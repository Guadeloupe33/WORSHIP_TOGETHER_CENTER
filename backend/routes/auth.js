const express = require('express');
const {
  registerUser,
  loginUser,
  getProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // ✅ Add this

const router = express.Router();

// 📸 Registration with photo upload
router.post('/register', upload.single('photo'), registerUser);

// 🔐 Login and get profile
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);

module.exports = router;
