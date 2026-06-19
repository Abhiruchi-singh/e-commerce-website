import express from 'express';
import { body, validationResult } from 'express-validator';
import Inquiry from '../models/Inquiry.js';

const router = express.Router();

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('message').notEmpty().withMessage('Message is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const inquiry = await Inquiry.create(req.body);
    res.status(201).json({ message: 'Thanks! We will get back to you within 24 hours.', id: inquiry._id });
  },
);

export default router;
