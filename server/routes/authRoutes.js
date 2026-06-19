import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Customer from '../models/Customer.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const formatProfile = (user, customer, token) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: customer?.phone || '',
  address: {
    street: customer?.street || '',
    city: customer?.city || '',
    state: customer?.state || '',
    zipCode: customer?.zipCode || '',
    country: customer?.country || 'India',
  },
  customerType: customer?.customerType || 'regular',
  preferredCategories: customer?.preferredCategories || [],
  memberSince: customer?.createdAt,
  ...(token ? { token } : {}),
});

const upsertCustomer = async (userId, data) => {
  const update = {};
  if (data.phone !== undefined) update.phone = data.phone;
  if (data.address) {
    if (data.address.street !== undefined) update.street = data.address.street;
    if (data.address.city !== undefined) update.city = data.address.city;
    if (data.address.state !== undefined) update.state = data.address.state;
    if (data.address.zipCode !== undefined) update.zipCode = data.address.zipCode;
    if (data.address.country !== undefined) update.country = data.address.country;
  }
  return Customer.findOneAndUpdate(
    { userId },
    { $set: update, $setOnInsert: { userId } },
    { upsert: true, new: true },
  );
};

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const user = await User.create({ name, email, password });
    const customer = await Customer.create({
      userId: user._id,
      customerType: 'regular',
      preferredCategories: [],
    });

    res.status(201).json(formatProfile(user, customer, generateToken(user._id)));
  },
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const customer = await Customer.findOne({ userId: user._id });
    res.json(formatProfile(user, customer, generateToken(user._id)));
  },
);

router.get('/profile', protect, async (req, res) => {
  const customer = await Customer.findOne({ userId: req.user._id });
  res.json(formatProfile(req.user, customer));
});

router.put('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  if (req.body.password) user.password = req.body.password;
  await user.save();

  const customer = await upsertCustomer(user._id, {
    phone: req.body.phone,
    address: req.body.address,
  });

  res.json(formatProfile(user, customer, generateToken(user._id)));
});

export default router;
