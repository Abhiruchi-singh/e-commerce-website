# Resume Checklist — Live Website + GitHub Link

Follow these steps **in order**. Skip nothing.

---

## Why your site is NOT opening right now

| Problem | Reason |
|---------|--------|
| No live URL | Render pe deploy **complete nahi** hua ya fail hua |
| GitHub link empty/wrong | Code **properly push nahi** hua (abhi **no commit** bhi hai) |
| MongoDB error on Render | `MONGODB_URI` missing ya galat |
| Wrong platform | Netlify pe MERN backend **nahi chalta** — Render use karo |
| Junk in repo | Old `1cb-ecommerce-main` folder — **ignore** karo, MERN project `client/` + `server/` hai |

---

## STEP 1 — Local test (VS Code)

```powershell
cd "c:\Users\RADHA KRISHNA SINGH\OneDrive\Desktop\E-commerce website"
npm run install:all
npm run dev
```

Open **http://localhost:5173** — products, login sab dikhe = project OK.

Login: `admin@ecommerce.com` / `admin123`

---

## STEP 2 — MongoDB Atlas (database — FREE)

**You do NOT create collections manually.** Server auto-creates them.

### Atlas setup (5 minutes)

1. https://cloud.mongodb.com → login
2. **Database Access** → user + password (save password!)
3. **Network Access** → **Allow Access from Anywhere** (`0.0.0.0/0`)
4. **Database** → **Connect** → **Drivers** → copy string:

```
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/ecommerce-mern-stack?retryWrites=true&w=majority
```

Replace `USERNAME`, `PASSWORD`, and cluster URL with yours.

### What happens automatically when server starts

| Collection | Data |
|------------|------|
| `products` | 33 products inserted |
| `users` | Admin + demo user created |
| `orders` | Created when customers checkout |
| `contacts` | Created when contact form submitted |

**Check in Atlas:** Database → Browse Collections → `ecommerce-mern-stack`

---

## STEP 3 — GitHub push (resume link)

### 3a. GitHub pe new repo

1. https://github.com/new
2. Name: `ecommerce-mern-stack`
3. **Public**
4. Do NOT add README (already have one)
5. Create repository

### 3b. Push code (PowerShell)

```powershell
cd "c:\Users\RADHA KRISHNA SINGH\OneDrive\Desktop\E-commerce website"

git add .
git commit -m "E-Commerce MERN Stack - full stack project"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ecommerce-mern-stack.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

**Resume GitHub link:** `https://github.com/YOUR_USERNAME/ecommerce-mern-stack`

---

## STEP 4 — Render deploy (live URL)

### 4a. Account

https://dashboard.render.com → **Sign up with GitHub**

### 4b. Deploy

1. **New** → **Blueprint** (or **Web Service**)
2. Connect GitHub repo `ecommerce-mern-stack`
3. Set environment variables:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Atlas connection string (Step 2) |
| `USE_MEMORY_DB` | `false` |
| `NODE_ENV` | `production` |
| `JWT_SECRET` | `MyEcommerceSecretKey2026` (any long string) |
| `CLIENT_URL` | `https://ecommerce-mern-stack.onrender.com` (your app name) |

4. **Build Command:** `npm run build:render`
5. **Start Command:** `npm run start:render`
6. **Free** plan → Deploy

Wait 5–10 minutes. First load may take 30–50 sec (free tier).

### 4c. After deploy

1. Copy URL: `https://YOUR-APP-NAME.onrender.com`
2. Update `CLIENT_URL` in Render to **exact** URL → Save → Redeploy
3. Test:
   - `/` — home page
   - `/shop` — products
   - `/api/db-info` — database connected (products count = 33)

**Resume Live link:** `https://YOUR-APP-NAME.onrender.com`

---

## STEP 5 — Update README + Resume

Edit `README.md` top lines:

```markdown
> **Live Demo:** https://YOUR-APP-NAME.onrender.com
> **GitHub:** https://github.com/YOUR_USERNAME/ecommerce-mern-stack
```

### Resume example

```
E-Commerce Website (MERN Stack)
Full-stack online store — React, Node.js, Express, MongoDB, JWT Auth
Live: https://YOUR-APP-NAME.onrender.com
GitHub: https://github.com/YOUR_USERNAME/ecommerce-mern-stack
```

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| Render build failed | Logs check; run `npm run build:render` locally |
| `MONGODB_URI is missing` | Render Environment → add `MONGODB_URI` |
| MongoDB connection failed | Atlas Network Access → `0.0.0.0/0` |
| Blank page | `CLIENT_URL` wrong — fix and redeploy |
| 502 / slow | Free tier sleeps — wait 30 sec, refresh |
| No products | Open `/api/db-info` — if 0 products, redeploy (seed runs on start) |
| Password special chars | URL-encode `@` → `%40` in connection string |

---

## Final checklist before resume

- [ ] http://localhost:5173 works locally
- [ ] GitHub repo public + code pushed
- [ ] Render deploy **Live** (green)
- [ ] `https://your-app.onrender.com/shop` shows products
- [ ] Login works on live site
- [ ] `/api/db-info` shows 33 products
- [ ] README has real GitHub + Live URLs
