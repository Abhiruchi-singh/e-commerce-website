import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { protect, admin } from '../middleware/auth.js';
import { verifyRazorpayPayment } from '../routes/paymentRoutes.js';

const router = express.Router();

router.post('/track', async (req, res) => {
  const { orderId, email } = req.body;
  if (!orderId || !email) {
    return res.status(400).json({ message: 'Order ID and email are required' });
  }

  let order;
  if (mongoose.Types.ObjectId.isValid(orderId) && String(orderId).length === 24) {
    order = await Order.findById(orderId);
  } else {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(500);
    order = orders.find((o) => o._id.toString().slice(-8).toLowerCase() === String(orderId).toLowerCase());
  }

  if (!order) {
    return res.status(404).json({ message: 'Order not found. Check your Order ID.' });
  }

  const user = await User.findById(order.user);
  if (!user || user.email.toLowerCase() !== email.toLowerCase()) {
    return res.status(404).json({ message: 'Order not found for this email address.' });
  }

  res.json(order);
});

router.post('/', protect, async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  } = req.body;

  if (!orderItems?.length) {
    return res.status(400).json({ message: 'No order items' });
  }

  const method = paymentMethod || 'COD';
  const isOnlinePayment = ['Razorpay', 'UPI', 'Card'].includes(method);

  if (isOnlinePayment) {
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ message: 'Payment details are required for online payment' });
    }
    if (!verifyRazorpayPayment({ razorpayOrderId, razorpayPaymentId, razorpaySignature })) {
      return res.status(400).json({ message: 'Payment verification failed. Please try again.' });
    }
  }

  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      return res.status(404).json({ message: `Product not found: ${item.product}` });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
    }
  }

  const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 500 ? 0 : 49;
  const taxPrice = Math.round(itemsPrice * 0.05);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod: method,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    isPaid: isOnlinePayment,
    paidAt: isOnlinePayment ? Date.now() : undefined,
    razorpayOrderId: isOnlinePayment ? razorpayOrderId : '',
    razorpayPaymentId: isOnlinePayment ? razorpayPaymentId : '',
    status: isOnlinePayment ? 'processing' : 'pending',
  });

  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }

  res.status(201).json(order);
});

router.get('/my', protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

router.get('/:id', protect, async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  res.json(order);
});

router.get('/', protect, admin, async (_req, res) => {
  const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
});

router.put('/:id/status', protect, admin, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  order.status = req.body.status || order.status;
  if (req.body.status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }

  const updated = await order.save();
  res.json(updated);
});

export default router;
