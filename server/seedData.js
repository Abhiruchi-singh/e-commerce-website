import User from './models/User.js';
import Product from './models/Product.js';
import Customer from './models/Customer.js';
import { localProductImage } from './productImages.js';

const rawProducts = [
  { name: 'Premium Cotton T-Shirt', slug: 'premium-cotton-tshirt', description: 'Soft, breathable cotton t-shirt perfect for everyday wear. Classic fit with reinforced stitching.', price: 899, salePrice: 699, category: 'Clothing', brand: 'StyleHub', stock: 50, rating: 4.5, numReviews: 24, featured: true, sizes: ['S', 'M', 'L', 'XL'], colors: ['White', 'Black', 'Navy'] },
  { name: 'Classic Denim Jacket', slug: 'classic-denim-jacket', description: 'Timeless denim jacket with modern cut. Durable and stylish for all seasons.', price: 2499, category: 'Clothing', brand: 'StyleHub', stock: 30, rating: 4.7, numReviews: 18, featured: true, sizes: ['S', 'M', 'L', 'XL'], colors: ['Blue', 'Black'] },
  { name: 'Running Sneakers Pro', slug: 'running-sneakers-pro', description: 'Lightweight running shoes with cushioned sole and breathable mesh upper.', price: 3999, salePrice: 3299, category: 'Footwear', brand: 'ActiveFit', stock: 40, rating: 4.8, numReviews: 56, sizes: ['7', '8', '9', '10', '11'], colors: ['Red', 'Black', 'White'] },
  { name: 'Leather Crossbody Bag', slug: 'leather-crossbody-bag', description: 'Genuine leather crossbody bag with adjustable strap and multiple compartments.', price: 1899, category: 'Accessories', brand: 'StyleHub', stock: 25, rating: 4.4, numReviews: 12, colors: ['Brown', 'Black'] },
  { name: 'Wireless Bluetooth Earbuds', slug: 'wireless-bluetooth-earbuds', description: 'Premium sound quality with active noise cancellation and 24-hour battery life.', price: 2999, salePrice: 2499, category: 'Electronics', brand: 'TechNova', stock: 60, rating: 4.6, numReviews: 89, featured: true, colors: ['White', 'Black'] },
  { name: 'Smart Fitness Watch', slug: 'smart-fitness-watch', description: 'Track your health metrics, workouts, and sleep with this advanced smartwatch.', price: 4999, category: 'Electronics', brand: 'TechNova', stock: 35, rating: 4.9, numReviews: 42, featured: true, colors: ['Black', 'Silver'] },
  { name: 'Slim Fit Chinos', slug: 'slim-fit-chinos', description: 'Comfortable stretch chinos with a modern slim fit.', price: 1599, category: 'Clothing', brand: 'StyleHub', stock: 45, rating: 4.3, numReviews: 15, sizes: ['30', '32', '34', '36'], colors: ['Khaki', 'Navy', 'Grey'] },
  { name: 'Polarized Sunglasses', slug: 'polarized-sunglasses', description: 'UV400 protection with polarized lenses.', price: 1299, salePrice: 999, category: 'Accessories', brand: 'StyleHub', stock: 55, rating: 4.5, numReviews: 31, colors: ['Black', 'Tortoise'] },
  { name: 'Wool Blend Sweater', slug: 'wool-blend-sweater', description: 'Cozy wool blend sweater with ribbed cuffs.', price: 2199, category: 'Clothing', brand: 'StyleHub', stock: 28, rating: 4.6, numReviews: 22, sizes: ['S', 'M', 'L', 'XL'], colors: ['Grey', 'Navy', 'Burgundy'] },
  { name: 'Canvas Sneakers', slug: 'canvas-sneakers', description: 'Classic canvas sneakers with rubber sole.', price: 1499, category: 'Footwear', brand: 'StyleHub', stock: 70, rating: 4.2, numReviews: 38, sizes: ['7', '8', '9', '10', '11'], colors: ['White', 'Navy', 'Red'] },
  { name: 'Stainless Steel Water Bottle', slug: 'stainless-steel-water-bottle', description: 'Insulated 750ml bottle keeps drinks cold for 24 hours.', price: 799, category: 'Accessories', brand: 'StyleHub', stock: 100, rating: 4.7, numReviews: 67, colors: ['Silver', 'Black', 'Blue'] },
  { name: 'Portable Bluetooth Speaker', slug: 'portable-bluetooth-speaker', description: 'Waterproof portable speaker with 360° sound.', price: 3499, salePrice: 2799, category: 'Electronics', brand: 'TechNova', stock: 42, rating: 4.5, numReviews: 45, colors: ['Black', 'Blue'] },
  // 20 NEW PRODUCTS
  { name: 'iPhone 15 Pro Max Case', slug: 'iphone-15-pro-max-case', description: 'Premium silicone case with MagSafe compatibility and drop protection.', price: 1299, salePrice: 999, category: 'Electronics', brand: 'TechNova', stock: 80, rating: 4.6, numReviews: 34, featured: true, colors: ['Black', 'Blue', 'Clear'] },
  { name: 'Gaming Mechanical Keyboard', slug: 'gaming-mechanical-keyboard', description: 'RGB backlit mechanical keyboard with blue switches for gaming enthusiasts.', price: 4499, salePrice: 3799, category: 'Electronics', brand: 'TechNova', stock: 25, rating: 4.8, numReviews: 67, featured: true, colors: ['Black'] },
  { name: '4K Ultra HD Smart TV 43"', slug: '4k-smart-tv-43', description: 'Crystal clear 4K display with built-in streaming apps and voice control.', price: 28999, salePrice: 24999, category: 'Electronics', brand: 'TechNova', stock: 15, rating: 4.7, numReviews: 28, featured: true },
  { name: 'Wireless Charging Pad', slug: 'wireless-charging-pad', description: 'Fast 15W wireless charger compatible with all Qi-enabled devices.', price: 1499, category: 'Electronics', brand: 'TechNova', stock: 90, rating: 4.4, numReviews: 52, colors: ['White', 'Black'] },
  { name: 'Laptop Stand Aluminum', slug: 'laptop-stand-aluminum', description: 'Ergonomic aluminum laptop stand with adjustable height and cooling design.', price: 2199, category: 'Electronics', brand: 'TechNova', stock: 40, rating: 4.5, numReviews: 19, colors: ['Silver', 'Space Grey'] },
  { name: 'USB-C Hub 7-in-1', slug: 'usb-c-hub-7in1', description: 'Multi-port USB-C hub with HDMI, USB 3.0, SD card reader and PD charging.', price: 2799, salePrice: 2299, category: 'Electronics', brand: 'TechNova', stock: 55, rating: 4.6, numReviews: 41, colors: ['Grey'] },
  { name: 'Over-Ear Headphones', slug: 'over-ear-headphones', description: 'Studio-quality over-ear headphones with 40mm drivers and plush ear cushions.', price: 5999, salePrice: 4999, category: 'Electronics', brand: 'TechNova', stock: 30, rating: 4.9, numReviews: 78, featured: true, colors: ['Black', 'White'] },
  { name: 'Tablet 10" Android', slug: 'tablet-10-android', description: '10-inch HD tablet with 64GB storage, dual cameras and long battery life.', price: 12999, salePrice: 10999, category: 'Electronics', brand: 'TechNova', stock: 20, rating: 4.5, numReviews: 33, colors: ['Silver', 'Black'] },
  { name: 'Formal White Shirt', slug: 'formal-white-shirt', description: 'Crisp cotton formal shirt perfect for office and special occasions.', price: 1799, salePrice: 1399, category: 'Clothing', brand: 'StyleHub', stock: 60, rating: 4.4, numReviews: 27, featured: true, sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['White', 'Light Blue'] },
  { name: 'Floral Summer Dress', slug: 'floral-summer-dress', description: 'Elegant floral print midi dress with flowing silhouette for summer occasions.', price: 2299, category: 'Clothing', brand: 'StyleHub', stock: 35, rating: 4.7, numReviews: 44, featured: true, sizes: ['S', 'M', 'L'], colors: ['Floral Pink', 'Floral Blue'] },
  { name: 'Men\'s Leather Belt', slug: 'mens-leather-belt', description: 'Genuine leather belt with classic buckle, fits all standard trouser loops.', price: 999, category: 'Clothing', brand: 'StyleHub', stock: 75, rating: 4.3, numReviews: 18, sizes: ['32', '34', '36', '38'], colors: ['Brown', 'Black'] },
  { name: 'Hooded Sweatshirt', slug: 'hooded-sweatshirt', description: 'Premium fleece-lined hoodie with kangaroo pocket and drawstring hood.', price: 1899, salePrice: 1499, category: 'Clothing', brand: 'StyleHub', stock: 50, rating: 4.6, numReviews: 62, featured: true, sizes: ['S', 'M', 'L', 'XL'], colors: ['Grey', 'Black', 'Navy'] },
  { name: 'Women\'s Palazzo Pants', slug: 'womens-palazzo-pants', description: 'Flowy wide-leg palazzo pants in breathable cotton blend fabric.', price: 1399, category: 'Clothing', brand: 'StyleHub', stock: 40, rating: 4.5, numReviews: 29, sizes: ['S', 'M', 'L', 'XL'], colors: ['Black', 'Olive', 'Maroon'] },
  { name: 'Checked Casual Shirt', slug: 'checked-casual-shirt', description: 'Trendy checked pattern casual shirt for a smart-casual look.', price: 1299, category: 'Clothing', brand: 'StyleHub', stock: 55, rating: 4.4, numReviews: 21, sizes: ['S', 'M', 'L', 'XL'], colors: ['Red Check', 'Blue Check'] },
  { name: 'Sports Track Pants', slug: 'sports-track-pants', description: 'Lightweight moisture-wicking track pants for gym and outdoor activities.', price: 1199, salePrice: 899, category: 'Clothing', brand: 'ActiveFit', stock: 65, rating: 4.3, numReviews: 37, sizes: ['S', 'M', 'L', 'XL'], colors: ['Black', 'Navy', 'Grey'] },
  { name: 'Silk Saree Premium', slug: 'silk-saree-premium', description: 'Handwoven pure silk saree with intricate border design for festive occasions.', price: 4999, salePrice: 3999, category: 'Clothing', brand: 'StyleHub', stock: 18, rating: 4.9, numReviews: 15, featured: true, colors: ['Red', 'Green', 'Gold'] },
  { name: 'Leather Formal Shoes', slug: 'leather-formal-shoes', description: 'Handcrafted genuine leather oxford shoes for formal and business wear.', price: 3499, salePrice: 2999, category: 'Footwear', brand: 'StyleHub', stock: 30, rating: 4.7, numReviews: 48, sizes: ['7', '8', '9', '10', '11'], colors: ['Brown', 'Black'] },
  { name: 'Women\'s Heels Stiletto', slug: 'womens-heels-stiletto', description: 'Elegant stiletto heels with cushioned insole for all-day comfort.', price: 2799, category: 'Footwear', brand: 'StyleHub', stock: 25, rating: 4.5, numReviews: 36, sizes: ['5', '6', '7', '8'], colors: ['Black', 'Nude', 'Red'] },
  { name: 'Smart LED Desk Lamp', slug: 'smart-led-desk-lamp', description: 'Adjustable LED desk lamp with touch control, USB charging port and eye-care mode.', price: 1899, category: 'Electronics', brand: 'TechNova', stock: 45, rating: 4.4, numReviews: 23, colors: ['White', 'Black'] },
  { name: 'Power Bank 20000mAh', slug: 'power-bank-20000mah', description: 'High-capacity 20000mAh power bank with fast charging and dual USB ports.', price: 1999, salePrice: 1599, category: 'Electronics', brand: 'TechNova', stock: 70, rating: 4.6, numReviews: 91, featured: true, colors: ['Black', 'Blue'] },
  { name: 'Cotton Kurta Set', slug: 'cotton-kurta-set', description: 'Traditional cotton kurta with matching pajama, perfect for festivals and casual wear.', price: 1699, category: 'Clothing', brand: 'StyleHub', stock: 42, rating: 4.6, numReviews: 53, featured: true, sizes: ['S', 'M', 'L', 'XL'], colors: ['White', 'Blue', 'Cream'] },
];

const products = rawProducts.map((p) => ({
  ...p,
  image: localProductImage(p.slug),
}));

export const seedDatabase = async () => {
  const expectedCount = products.length;
  const productCount = await Product.countDocuments();

  if (productCount < expectedCount || process.env.SEED_FORCE === 'true') {
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products`);
  } else if (productCount >= expectedCount) {
    for (const p of products) {
      await Product.updateOne(
        { slug: p.slug },
        {
          $set: {
            image: p.image,
            brand: p.brand,
            description: p.description,
            price: p.price,
            salePrice: p.salePrice,
            stock: p.stock,
            category: p.category,
            featured: p.featured ?? false,
          },
        },
      );
    }
    console.log('Product catalog synced (images & details updated)');
  }

  const userCount = await User.countDocuments();
  if (userCount === 0) {
    const admin = await User.create({
      name: 'Abhiruchi Singh',
      email: 'admin@ecommerce.com',
      password: 'admin123',
      role: 'admin',
    });
    const customerUser = await User.create({
      name: 'Ananya Verma',
      email: 'user@ecommerce.com',
      password: 'user123',
      role: 'user',
    });

    await Customer.create({
      userId: admin._id,
      phone: '8174966042',
      street: 'Flat 204, Arjun Marg',
      city: 'Gurgaon',
      state: 'Haryana',
      zipCode: '122001',
      country: 'India',
      customerType: 'premium',
      preferredCategories: ['Electronics', 'Accessories'],
      notes: 'Store owner account',
    });

    await Customer.create({
      userId: customerUser._id,
      phone: '9876543210',
      street: '42, Karol Bagh',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110005',
      country: 'India',
      customerType: 'regular',
      preferredCategories: ['Clothing', 'Footwear'],
      notes: 'Prefers weekend delivery',
    });

    console.log('Users + customer profiles created');
    console.log('Admin: admin@ecommerce.com / admin123');
    console.log('Customer: user@ecommerce.com / user123');
  } else {
    const users = await User.find();
    const admin = users.find((u) => u.role === 'admin');
    const regular = users.find((u) => u.role === 'user');
    if (admin) {
      admin.name = 'Abhiruchi Singh';
      await admin.save();
      await Customer.findOneAndUpdate(
        { userId: admin._id },
        {
          phone: '8174966042',
          street: 'Flat 204, Arjun Marg',
          city: 'Gurgaon',
          state: 'Haryana',
          zipCode: '122001',
          customerType: 'premium',
          preferredCategories: ['Electronics', 'Accessories'],
        },
        { upsert: true },
      );
    }
    if (regular) {
      await Customer.findOneAndUpdate(
        { userId: regular._id },
        {
          phone: '9876543210',
          street: '42, Karol Bagh',
          city: 'New Delhi',
          state: 'Delhi',
          zipCode: '110005',
          customerType: 'regular',
          preferredCategories: ['Clothing', 'Footwear'],
        },
        { upsert: true },
      );
    }
  }
};
