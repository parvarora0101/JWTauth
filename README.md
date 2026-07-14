# Nimbus — MERN Auth (MVC)

A basic login/signup system built the MERN way, with the backend following
MVC architecture and connected to MongoDB via Mongoose.

## Structure

```
mern-auth-app/
├── backend/
│   ├── config/db.js              # Mongoose connection
│   ├── models/User.js            # Model — schema, password hashing
│   ├── controllers/authController.js  # Controller — business logic
│   ├── routes/authRoutes.js      # Routes → controller wiring
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   └── errorMiddleware.js    # Centralized error handling
│   ├── server.js                 # App entry point
│   └── .env.example
└── frontend/
    └── src/
        ├── pages/Login.jsx       # Login page (View)
        ├── pages/Signup.jsx
        ├── pages/Dashboard.jsx   # Protected page after login
        ├── context/AuthContext.jsx
        └── api/axios.js
```

The "View" in this MVC backend is the JSON the controllers return — this is
a decoupled API + SPA setup, not server-rendered templates.

## Run it

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI (local Mongo or Atlas) and a real JWT_SECRET
npm run dev
```

Runs on `http://localhost:5000`. Make sure MongoDB is running locally, or
point `MONGO_URI` at an Atlas cluster.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173` and proxies `/api` requests to the backend.

## API endpoints

| Method | Endpoint            | Access  | Description              |
|--------|---------------------|---------|---------------------------|
| POST   | /api/auth/register  | Public  | Create account, returns JWT |
| POST   | /api/auth/login     | Public  | Verify credentials, returns JWT |
| GET    | /api/auth/me        | Private | Get current user (needs `Authorization: Bearer <token>`) |

## Notes on security

- Passwords are hashed with bcrypt before saving (never stored in plain text).
- JWTs are signed with `JWT_SECRET` — replace the example value before deploying.
- The `password` field uses `select: false` in the schema, so it's never
  returned in queries unless explicitly requested (as login does, to compare it).
- This is a learning/starter setup — for production, also add: rate limiting
  on auth routes, HTTPS-only cookies instead of localStorage for the token
  (to reduce XSS risk), input sanitization, and refresh tokens.
