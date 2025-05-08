const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getProfile,
  updateProfile,
  changePassword
} = require('../controllers/authController');
const upload = require('../middleware/uploadMiddleware'); // ✅ Import multer middleware

const router = express.Router();

// Get and update profile
router.get('/', protect, getProfile);
router.put('/', protect, updateProfile); 
router.put('/change-password', protect, changePassword); 

// ✅ Profile photo upload route
router.post('/upload-photo', protect, upload.single('photo'), async (req, res) => {
  try {
    const user = await require('../models/user').findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.photo = req.file.filename;
    await user.save();

    res.json({
      message: 'Profile photo uploaded successfully',
      photoUrl: `/uploads/${user.photo}`
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
