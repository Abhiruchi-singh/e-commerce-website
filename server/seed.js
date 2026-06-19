import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { seedDatabase } from './seedData.js';

dotenv.config();

const seed = async () => {
  try {
    await connectDB();
    const Product = (await import('./models/Product.js')).default;
    const User = (await import('./models/User.js')).default;
    const Customer = (await import('./models/Customer.js')).default;
    await Product.deleteMany();
    await Customer.deleteMany();
    await User.deleteMany();
    await seedDatabase();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
