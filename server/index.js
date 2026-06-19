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
import paymentRoutes from './routes/paymentRoutes.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import Customer from './models/Customer.js';
import Inquiry from './models/Inquiry.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';
let dbReady = false;

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
  res.json({
    status: dbReady ? 'ok' : 'starting',
    message: dbReady ? 'StyleHub API is running' : 'Database is starting — please wait and refresh',
    databaseReady: dbReady,
  });
});

app.use('/api', (req, res, next) => {
  if (!dbReady && req.path !== '/health' && req.path !== '/db-info') {
    return res.status(503).json({
      message: 'Database is starting. If this takes more than 2 minutes, check MongoDB Atlas IP whitelist (0.0.0.0/0).',
    });
  }
  next();
});

app.get('/api/db-info', async (_req, res) => {
  try {
    const [users, customers, products, orders, inquiries] = await Promise.all([
      User.countDocuments(),
      Customer.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Inquiry.countDocuments(),
    ]);
    res.json({
      database: mongoose.connection.name,
      host: mongoose.connection.host,
      mode: process.env.USE_MEMORY_DB === 'true' ? 'in-memory (resets on restart)' : 'persistent MongoDB',
      collections: {
        users: { count: users, stores: 'login accounts (email, password, role)' },
        customers: { count: customers, stores: 'customer profiles, addresses, preferences' },
        products: { count: products, stores: 'shop catalog' },
        orders: { count: orders, stores: 'order history' },
        inquiries: { count: inquiries, stores: 'contact form & support messages' },
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
app.use('/api/payment', paymentRoutes);

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
  const server = app.listen(PORT, () => {
    console.log('========================================');
    console.log('  StyleHub India — E-Commerce');
    console.log('========================================');
    console.log(`  Backend API : http://localhost:${PORT}/api`);
    console.log(`  Frontend    : http://localhost:5173`);
    console.log(`  DB Info     : http://localhost:${PORT}/api/db-info`);
    console.log('  Connecting database in background…');
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

  try {
    await connectDB();
    dbReady = true;
    console.log(`  Database    : ${mongoose.connection.name}`);
    console.log(`  Collections : users, customers, products, orders, inquiries`);
    console.log(`  DB Mode     : ${process.env.USE_MEMORY_DB === 'true' ? 'In-Memory (dev)' : 'MongoDB Persistent'}`);
    await seedDatabase();
  } catch (err) {
    console.error('Database startup failed:', err.message);
  }
};

startServer();
