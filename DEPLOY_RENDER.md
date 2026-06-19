# Render Deploy + MongoDB Atlas — Complete Guide

Puri MERN website (frontend + backend + database) deploy karne ke liye ye steps follow karo.

---

## Part 1 — Local VS Code Pe Run (Browser Mein Dekhne Ke Liye)

### Kya install chahiye?

| Software | Link | Zaroori? |
|----------|------|----------|
| **Node.js** (v18+) | https://nodejs.org | ✅ Haan |
| **VS Code** | https://code.visualstudio.com | ✅ Haan |
| **MongoDB local** | — | ❌ Nahi (project in-memory DB use karta hai local pe) |
| **MongoDB Atlas** | https://cloud.mongodb.com | ❌ Local ke liye nahi, Render ke liye haan |

### Commands (VS Code Terminal mein)

```powershell
# 1. Project folder open karo VS Code mein
# 2. Terminal kholo: Ctrl + `

# 3. Pehli baar — dependencies install:
npm run install:all

# 4. Website start karo
npm run dev
```

### Browser mein kholo

| URL | Kya dikhega |
|-----|-------------|
| **http://localhost:5173** | Poori website (Home, Shop, Login, Cart) |
| http://localhost:5000/api/health | API working check |
| http://localhost:5000/api/db-info | Database info |

**Band karne ke liye:** Terminal mein `Ctrl + C`

### Demo Login

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@ecommerce.com | admin123 |
| User | user@ecommerce.com | user123 |

---

## Part 2 — MongoDB Atlas Setup (Render Ke Liye — FREE)

Render pe data save karne ke liye **MongoDB Atlas** (cloud database) chahiye.

### Step 1 — Account banao

1. https://cloud.mongodb.com pe jao
2. **Sign Up** (Google se bhi kar sakte ho)
3. **Create an Organization** → koi bhi name

### Step 2 — Free Cluster banao

1. **Build a Database** click karo
2. **M0 FREE** plan select karo
3. Provider: **AWS**, Region: **Mumbai (ap-south-1)** ya nearest
4. Cluster name: `ecommerce-cluster` (kuch bhi)
5. **Create Deployment**

### Step 3 — Database User banao

1. Left menu → **Database Access**
2. **Add New Database User**
3. Authentication: **Password**
4. Username: `ecommerceuser` (apna choose karo)
5. Password: **Generate Secure Password** → **COPY KARO** (save rakho!)
6. Privileges: **Read and write to any database**
7. **Add User**

### Step 4 — Network Access (important!)

1. Left menu → **Network Access**
2. **Add IP Address**
3. **Allow Access from Anywhere** (`0.0.0.0/0`) select karo
4. **Confirm**

### Step 5 — Connection String copy karo

1. Left menu → **Database** → **Connect**
2. **Drivers** select karo
3. Driver: **Node.js**, Version: latest
4. Connection string copy karo:

```
mongodb+srv://ecommerceuser:<password>@ecommerce-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

5. `<password>` ko apne actual password se replace karo
6. End mein database name add karo:

```
mongodb+srv://ecommerceuser:YOUR_PASSWORD@cluster.xxxxx.mongodb.net/ecommerce-mern-stack?retryWrites=true&w=majority
```

**Ye string save karo — Render pe paste karenge.**

---

## Part 3 — GitHub Pe Push

```powershell
cd "c:\Users\RADHA KRISHNA SINGH\OneDrive\Desktop\E-commerce website"
git add .
git commit -m "Ready for Render deploy with MongoDB Atlas"
git push
```

---

## Part 4 — Render Pe Deploy

### Option A — Blueprint (Recommended)

1. https://dashboard.render.com → Login (GitHub se)
2. **New** → **Blueprint**
3. Apna GitHub repo connect karo
4. `render.yaml` auto-detect hoga
5. Environment variables set karo:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Atlas connection string (Part 2 Step 5) |
| `CLIENT_URL` | `https://ecommerce-mern-stack.onrender.com` |
| `USE_MEMORY_DB` | `false` |
| `NODE_ENV` | `production` |
| `JWT_SECRET` | koi long random string |
| `RAZORPAY_KEY_ID` | Razorpay Dashboard → API Keys (test ya live) |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key (same dashboard) |

6. **Apply** → Deploy start!

### Razorpay Setup (Online Payment)

1. https://dashboard.razorpay.com → Sign up (free test mode)
2. **Settings → API Keys** → Generate Test Keys
3. Copy `Key ID` → `RAZORPAY_KEY_ID`
4. Copy `Key Secret` → `RAZORPAY_KEY_SECRET`
5. Local: paste in `server/.env`
6. Render: add both keys in Environment Variables → redeploy

Checkout pe **Pay Online (Razorpay)** option dikhega — UPI, Card, Netbanking sab kaam karega.

---

### Option B — Manual Web Service

| Setting | Value |
|---------|-------|
| Build Command | `npm run build:render` |
| Start Command | `npm run start:render` |
| Instance Type | **Free** |

### Deploy ke baad

- Website URL: `https://your-app-name.onrender.com`
- `CLIENT_URL` ko exact URL se update karo, phir redeploy

---

## Part 5 — Verify

| Check | URL |
|-------|-----|
| Home page | `/` |
| Products | `/shop` |
| Login | admin@ecommerce.com / admin123 |
| API | `/api/health` |
| Database | `/api/db-info` |
