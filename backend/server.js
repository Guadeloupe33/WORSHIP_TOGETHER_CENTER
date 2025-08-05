const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');





dotenv.config();
const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(express.json());

app.use(cors({
  origin: ['http://localhost:5501', 'http://127.0.0.1:5501', 'http://localhost:5502', 'http://127.0.0.1:5502'],
  credentials: true
}));


  

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile')); // <-- now after app is defined
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));


// Start server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
