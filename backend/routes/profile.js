// routes/profile.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getProfile, updateProfile, changePassword,  } = require('../controllers/authController');

const router = express.Router();

// Protected route to get user profile
router.get('/', protect, getProfile);
router.put('/', protect, updateProfile); 
router.put('/change-password', protect, changePassword); 

module.exports = router;
