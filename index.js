import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { seedDatabase } from './seedData.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import Contact from './models/Contact.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5000',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || isProduction) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
}));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'E-Commerce Website MERN Stack API is running' });
});

app.get('/api/db-info', async (_req, res) => {
  try {
    const [users, products, orders, contacts] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Contact.countDocuments(),
    ]);
    res.json({
      database: mongoose.connection.name,
      host: mongoose.connection.host,
      mode: process.env.USE_MEMORY_DB === 'true' ? 'in-memory (resets on restart)' : 'persistent MongoDB',
      collections: {
        users: { count: users, stores: 'login emails, passwords (hashed), names' },
        products: { count: products, stores: 'all shop items' },
        orders: { count: orders, stores: 'customer orders' },
        contacts: { count: contacts, stores: 'contact form messages' },
      },
      urls: {
        api: `http://localhost:${PORT}/api`,
        health: `http://localhost:${PORT}/api/health`,
        dbInfo: `http://localhost:${PORT}/api/db-info`,
        frontend: 'http://localhost:5173',
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);

if (isProduction) {
  const clientDist = path.join(__dirname, '../client/dist');
  app.use(express.static(clientDist));
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Server error' });
});

const startServer = async () => {
  await connectDB();
  await seedDatabase();

  const server = app.listen(PORT, () => {
    console.log('========================================');
    console.log('  E-Commerce Website MERN Stack');
    console.log('========================================');
    console.log(`  Backend API : http://localhost:${PORT}/api`);
    console.log(`  Frontend    : http://localhost:5173`);
    console.log(`  DB Info     : http://localhost:${PORT}/api/db-info`);
    console.log(`  Database    : ${mongoose.connection.name}`);
    console.log(`  Collections : users, products, orders, contacts`);
    console.log(`  DB Mode     : ${process.env.USE_MEMORY_DB === 'true' ? 'In-Memory (dev)' : 'MongoDB Persistent'}`);
    console.log('========================================');
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\nPort ${PORT} is already in use!`);
      console.error('Fix: Close old terminal or run this command:');
      console.error(`  Get-NetTCPConnection -LocalPort ${PORT} | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }`);
      process.exit(1);
    }
    throw err;
  });
};

startServer();
