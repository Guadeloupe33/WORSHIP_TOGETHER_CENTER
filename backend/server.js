// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

dotenv.config();
const app = express();
connectDB();

const allowed = [
  'http://127.0.0.1:5501', // <-- your front end
  'http://127.0.0.1:5500', // optional if you sometimes serve HTML from 5500
  'http://localhost:5501', // optional, but nice to have
  'http://localhost:5500'
];

app.use(cors({
  origin(origin, cb) {
    if (!origin || allowed.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true, // needed if you use cookies
}));

// Explicitly handle preflight for all routes
app.options('*', cors({ origin: allowed, credentials: true }));

app.use(express.json());

// quick health-check
app.get('/api/ping', (req, res) => res.json({ ok: true, ts: Date.now() }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
