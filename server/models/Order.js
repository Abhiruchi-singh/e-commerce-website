import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  size: { type: String, default: '' },
  color: { type: String, default: '' },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [orderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true, default: 'COD' },
    itemsPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    taxPrice: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    razorpayOrderId: { type: String, default: '' },
    razorpayPaymentId: { type: String, default: '' },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
