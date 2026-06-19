# E-Commerce Website — Full Stack MERN

> **Live Demo:** `https://YOUR-APP-NAME.onrender.com`  
> **GitHub:** `https://github.com/YOUR_USERNAME/ecommerce-mern-stack`

Full-stack e-commerce platform with React frontend, Express REST API, MongoDB database, JWT authentication, shopping cart, orders, and admin dashboard.

## Resume Line (copy-paste)

```
E-Commerce Website (MERN Stack) — Full-stack online store with React, Node.js, Express, MongoDB.
Features: user auth, product catalog (33 items), cart, checkout, order tracking, admin panel.
Live: https://YOUR-APP-NAME.onrender.com | GitHub: https://github.com/YOUR_USERNAME/ecommerce-mern-stack
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT, bcrypt |
| Deploy | Render + MongoDB Atlas |

## Features

- User registration & login (JWT)
- 33 products with images (Clothing, Electronics, Footwear, Accessories)
- Shopping cart & checkout (COD + Razorpay online payment)
- Order history & tracking
- Admin dashboard (products + orders)
- Contact form (saved to database)
- Responsive UI

## Database Collections (auto-created)

| Collection | Stores |
|------------|--------|
| `users` | Login, passwords (hashed), roles |
| `products` | 33 shop products |
| `orders` | Customer orders |
| `contacts` | Contact form messages |

Data is **auto-seeded** when server starts (no manual MongoDB setup needed).

## Quick Start (VS Code)

```bash
npm run install:all
npm run dev
```

| URL | Purpose |
|-----|---------|
| http://localhost:5173 | Website |
| http://localhost:5000/api/health | API check |
| http://localhost:5000/api/db-info | Database check |

**Demo login:** `admin@ecommerce.com` / `admin123`

## Deploy to Render (Live URL for Resume)

**Full guide:** [`DEPLOY_RENDER.md`](DEPLOY_RENDER.md)

1. MongoDB Atlas — free cluster + connection string
2. GitHub — push this repo
3. Render — connect repo, set `MONGODB_URI`, `CLIENT_URL`, `USE_MEMORY_DB=false`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
4. Copy live URL to resume

---
