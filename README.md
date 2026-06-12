# E-Commerce Website MERN Stack

Full-stack e-commerce website built with **MongoDB, Express.js, React (Vite), Node.js**.

## Live URLs (Local)

| Service | URL |
|---------|-----|
| **Website (Frontend)** | http://localhost:5173 |
| **Backend API** | http://localhost:5000/api |
| **Database Info** | http://localhost:5000/api/db-info |
| **Health Check** | http://localhost:5000/api/health |

## One Command — Puri Website Chalegi

```bash
npm run install:all
npm run dev
```

Yeh **ek hi command** se frontend + backend dono start karta hai. Alag command ki zaroorat nahi.

- Frontend → http://localhost:5173
- Backend  → http://localhost:5000

## MongoDB — Data Kahan Store Hota Hai?

| Item | Value |
|------|-------|
| **Database Name** | `ecommerce-mern-stack` |
| **Collection: users** | Login email, password (encrypted), name |
| **Collection: products** | 32 shop products |
| **Collection: orders** | Customer orders |
| **Collection: contacts** | Contact form messages |

### Database Data Dekhne Ke Liye

Browser mein kholo: **http://localhost:5000/api/db-info**

Yeh dikhayega kitne users, products, orders, contacts hain.

### Demo Login

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@ecommerce.com | admin123 |
| User | user@ecommerce.com | user123 |

## GitHub Pe Push Kaise Karein

```bash
# 1. GitHub par naya repo banao: "ecommerce-mern-stack"

# 2. Project folder mein ye commands chalao:
git add .
git commit -m "E-Commerce MERN Stack - full stack project"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ecommerce-mern-stack.git
git push -u origin main
```

Resume mein likho:
> **E-Commerce Website MERN Stack** — https://github.com/YOUR_USERNAME/ecommerce-mern-stack

## Deploy

```bash
npm run start
```

Production ke liye MongoDB Atlas use karein aur `server/.env` mein:
```
USE_MEMORY_DB=false
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ecommerce-mern-stack
NODE_ENV=production
```

## Tech Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT + bcrypt
