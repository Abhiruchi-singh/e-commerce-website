import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    phone: { type: String, default: '' },
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    zipCode: { type: String, default: '' },
    country: { type: String, default: 'India' },
    customerType: { type: String, enum: ['regular', 'premium'], default: 'regular' },
    preferredCategories: [{ type: String }],
    notes: { type: String, default: '' },
  },
  { timestamps: true },
);

export default mongoose.model('Customer', customerSchema);
