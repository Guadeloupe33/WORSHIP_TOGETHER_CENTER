const User = require('../models/user');
const jwt = require('jsonwebtoken');
const denominationsList = require('../utils/denominations');


// Generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// @desc    Register new user


exports.registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      accountType,
      religion,
      denomination,
      organizationName,
      mission,
      website
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // ✅ Validate denomination matches religion (if both provided)
    if (religion && denomination) {
      const validDenominations = denominationsList[religion];
      if (!validDenominations || !validDenominations.includes(denomination)) {
        return res.status(400).json({
          message: `Invalid denomination "${denomination}" for religion "${religion}"`
        });
      }
    }
 // ✅ Handle uploaded photo
 const photo = req.file ? req.file.filename : '';
    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      accountType,
      religion,
      denomination,
      organizationName,
      mission,
      website
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      accountType: user.accountType,
      religion: user.religion,
      denomination: user.denomination,
      organizationName: user.organizationName,
      mission: user.mission,
      website: user.website,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error('❌ Register error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// @desc    Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      accountType: user.accountType,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Get logged-in user's profile
exports.getProfile = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  const fullPhotoUrl = req.user.photo
    ? `${req.protocol}://${req.get('host')}/uploads/${req.user.photo}`
    : '';

  res.status(200).json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    accountType: req.user.accountType,
    religion: req.user.religion,
    denomination: req.user.denomination,
    organizationName: req.user.organizationName,
    mission: req.user.mission,
    website: req.user.website,
    photo: fullPhotoUrl
  });
};




exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const {
      name,
      email,
      password,
      accountType,
      religion,
      denomination,
      organizationName,
      mission,
      website
    } = req.body;

    // ✅ Validate denomination if religion is also provided
    if (religion && denomination) {
      const validDenominations = denominationsList[religion];
      if (!validDenominations || !validDenominations.includes(denomination)) {
        return res.status(400).json({
          message: `Invalid denomination "${denomination}" for religion "${religion}"`
        });
      }
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (accountType) user.accountType = accountType;
    if (religion) user.religion = religion;
    if (denomination) user.denomination = denomination;
    if (organizationName) user.organizationName = organizationName;
    if (mission) user.mission = mission;
    if (website) user.website = website;
    if (password) user.password = password;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      accountType: updatedUser.accountType,
      religion: updatedUser.religion,
      denomination: updatedUser.denomination,
      organizationName: updatedUser.organizationName,
      mission: updatedUser.mission,
      website: updatedUser.website,
      token: generateToken(updatedUser._id),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
// @desc    Change user password
exports.changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new passwords are required' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword; // Will be hashed on save
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
