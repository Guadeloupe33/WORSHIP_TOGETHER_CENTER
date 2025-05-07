// routes/profile.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getProfile } = require('../controllers/authController');

const router = express.Router();

// Protected route to get user profile
router.get('/', protect, getProfile);

module.exports = router;
