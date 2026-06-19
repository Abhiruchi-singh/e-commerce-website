import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, min: 0 },
    category: { type: String, required: true },
    brand: { type: String, default: 'StyleHub' },
    image: { type: String, required: true },
    images: [{ type: String }],
    stock: { type: Number, required: true, min: 0, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    tags: [{ type: String }],
    sizes: [{ type: String }],
    colors: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
