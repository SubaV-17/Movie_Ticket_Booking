# 🎬 MovieTime — Full Stack Cinema Booking App
# Django + React + MongoDB

## Project Structure
```
cineproject/
├── backend/        ← Django REST API
└── frontend/       ← React App
```

## ── QUICK START ──────────────────────────────────────

### Step 1 — Install MongoDB
Make sure MongoDB is running on localhost:27017
  Windows: https://www.mongodb.com/try/download/community
  Mac:     brew install mongodb-community && brew services start mongodb-community
  Linux:   sudo systemctl start mongod

### Step 2 — Backend Setup
Open Terminal 1:

  cd cineproject/backend
  pip install -r requirements.txt
  python seed.py              ← Seeds movies into MongoDB (run once)
  python manage.py runserver  ← Starts API on http://localhost:8000

### Step 3 — Frontend Setup
Open Terminal 2:

  cd cineproject/frontend
  npm install                 ← Install packages (run once)
  npm start                   ← Starts React on http://localhost:3000

### Step 4 — Open Browser
  http://localhost:3000

## ── API ENDPOINTS ────────────────────────────────────

  POST  /api/auth/register/         Register new user
  POST  /api/auth/login/            Login → returns JWT token
  GET   /api/auth/me/               Get current user (auth required)

  GET   /api/movies/                List all movies
  GET   /api/movies/<id>/           Movie detail + shows

  POST  /api/bookings/create/       Create booking (auth required)
  GET   /api/bookings/mine/         My bookings (auth required)
  POST  /api/bookings/cancel/<id>/  Cancel booking (auth required)
  GET   /api/bookings/seats/<show_id>/  Get booked seats for a show

  POST  /api/contact/               Submit contact message

## ── USER FLOW ────────────────────────────────────────
  Register/Login → Browse Movies → Pick Show →
  Select Seats → Pay → Booking Confirmed ✅

## ── TECH STACK ───────────────────────────────────────
  Frontend : React 18, React Router, Axios
  Backend  : Django 4.2, Django REST Framework
  Database : MongoDB (via pymongo)
  Auth     : JWT (PyJWT + bcrypt)
