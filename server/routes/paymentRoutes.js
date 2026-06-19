import express from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const getRazorpay = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

router.get('/config', (_req, res) => {
  res.json({
    keyId: process.env.RAZORPAY_KEY_ID || '',
    enabled: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
  });
});

router.post('/create-order', protect, async (req, res) => {
  const razorpay = getRazorpay();
  if (!razorpay) {
    return res.status(503).json({ message: 'Online payment is not configured. Use Cash on Delivery.' });
  }

  const amount = Number(req.body.amount);
  if (!amount || amount < 1) {
    return res.status(400).json({ message: 'Invalid payment amount' });
  }

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `stylehub_${req.user._id.toString().slice(-6)}_${Date.now()}`,
    });
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (error) {
    console.error('Razorpay create order error:', error.message);
    res.status(500).json({ message: 'Could not create payment order. Try again or use COD.' });
  }
});

export const verifyRazorpayPayment = ({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
  return expected === razorpaySignature;
};

export default router;

