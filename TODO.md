# Deployment checklist (Free: Vercel + Render + MongoDB Atlas)

> All code changes needed were already applied.
> This file lists **exactly what you must update in dashboards/config**, plus where.

---

## 1) Confirm code-side changes (already done)

### Backend CORS (strict allowlist)
- **File:** `backend/server.js`
- **What it does:** allows only the origin in `process.env.FRONTEND_ORIGIN`
- **What you must set:** `FRONTEND_ORIGIN` on **Render**

### Frontend API URL (no localhost in production)
- **File:** `frontend/src/api/axios.js`
- **What it does:** uses `${import.meta.env.VITE_API_URL}/api`
- **What you must set:** `VITE_API_URL` on **Vercel**

### Env secrets ignored
- **File:** `.gitignore`
- **What it does:** ignores `.env` so it won’t be pushed to GitHub

---

## 2) MongoDB Atlas (free tier)

### 2.1 Create free cluster
- Go to: **MongoDB Atlas** → **Create**
- Choose: **Free tier (M0)**

### 2.2 Create database user
- **Atlas:** Security → Database Access → Add New Database User
- Save credentials as:
  - `DB_USERNAME`
  - `DB_PASSWORD`

### 2.3 Network access (critical for Render)
- **Atlas:** Security → Network Access
- Add allowlist entries:
  1. Your **local IP** (for testing)
  2. **Render’s outbound IP** (required)

> If Render can’t connect, 99% of the time this allowlist is the cause.

### 2.4 Get connection string
- Atlas → your cluster → **Connect** → copy the **SRV** URI
- It will look like:
  `mongodb+srv://<username>:<password>@<cluster>/<dbname>?retryWrites=true&w=majority`

---

## 3) Render (backend free tier)

### 3.1 GitHub setup
- Ensure your repo is pushed to GitHub.
- Render will deploy from this repository.

### 3.2 Create Render Web Service
- Render → New + → Web Service
- Select:
  - **Region:** pick one close to you
  - **Build command:** `npm install`
  - **Start command:** `npm start`
  - Backend `start` runs `node server.js` (from `backend/package.json`)

### 3.3 Set Render environment variables (backend)
In your Render Web Service → **Environment** set:

1. `MONGO_URI`
   - Value: your Atlas SRV connection string
2. `JWT_SECRET`
   - Value: any strong random string
3. `FRONTEND_ORIGIN`
   - Value: your Vercel frontend URL, exactly (example):
     - `https://your-app.vercel.app`

> IMPORTANT: backend will reject requests if `FRONTEND_ORIGIN` does not match exactly.

---

## 4) Vercel (frontend free tier)

### 4.1 Import React/Vite project
- Vercel → Add New… → Import Project (from GitHub)
- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`

### 4.2 Set Vercel environment variables (frontend)
Vercel project → **Settings → Environment Variables** set:
- `VITE_API_URL`
  - Value: your Render backend base URL (example):
    - `https://your-backend.onrender.com`

---

## 5) Smoke test after deploy

### 5.1 Backend health
- Visit:
  - `GET https://<render-backend-domain>/api/health`
- Expected:
  - `{ "status": "ok" }`

### 5.2 Auth endpoints
Test from browser/Postman/curl:

1) Register
- `POST https://<render-backend-domain>/api/auth/register`
- Body:
```json
{ "name":"Test", "email":"test@example.com", "password":"password123" }
```

2) Login
- `POST https://<render-backend-domain>/api/auth/login`
- Body:
```json
{ "email":"test@example.com", "password":"password123" }
```

### 5.3 Verify protected route
If your UI calls it, validate:
- `GET https://<render-backend-domain>/api/auth/me`
- Header:
  - `Authorization: Bearer <token>`

### 5.4 Verify Atlas write + hashing
- In Atlas, confirm a user document exists.
- Confirm `password` is hashed (bcrypt hash), not plaintext.

---

## 6) If something fails (fast debugging)

### Frontend errors (CORS / network)
- Most likely:
  - `VITE_API_URL` wrong
  - `FRONTEND_ORIGIN` wrong or missing on Render

### Backend errors (Render logs)
- Most likely:
  - `MONGO_URI` wrong
  - Atlas IP allowlist missing Render outbound IP
  - `JWT_SECRET` missing

### MongoDB errors (Atlas)
- Most likely:
  - Network access not updated for Render

---

## 7) Note about local dev
- Local dev can still use Vite proxy (`frontend/vite.config.js`).
- Production uses `VITE_API_URL` only.

