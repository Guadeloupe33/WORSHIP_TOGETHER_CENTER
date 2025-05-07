const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    console.log('🛡️ Received token:', token); // 👈 Add this
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('🔓 Decoded:', decoded); // 👈 Add this

    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    console.error('❌ Token verification failed:', err.message); // 👈 Add this
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};


module.exports = { protect };
