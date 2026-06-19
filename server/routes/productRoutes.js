import express from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const filter = {};

  if (req.query.category) filter.category = req.query.category;
  if (req.query.featured === 'true') filter.featured = true;
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
      { brand: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  let sort = { createdAt: -1 };
  if (req.query.sort === 'price-asc') sort = { price: 1 };
  if (req.query.sort === 'price-desc') sort = { price: -1 };
  if (req.query.sort === 'rating') sort = { rating: -1 };

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  res.json({
    products,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
});

router.get('/categories', async (_req, res) => {
  const categories = await Product.distinct('category');
  res.json(categories);
});

router.get('/:idOrSlug', async (req, res) => {
  const { idOrSlug } = req.params;

  try {
    let product = null;

    if (mongoose.Types.ObjectId.isValid(idOrSlug) && String(new mongoose.Types.ObjectId(idOrSlug)) === idOrSlug) {
      product = await Product.findById(idOrSlug);
    }

    if (!product) {
      product = await Product.findOne({ slug: idOrSlug });
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch {
    res.status(400).json({ message: 'Invalid product id' });
  }
});

router.post('/', protect, admin, async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

router.put('/:id', protect, admin, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

router.delete('/:id', protect, admin, async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json({ message: 'Product removed' });
});

export default router;
