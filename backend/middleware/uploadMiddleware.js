const multer = require('multer');
const path = require('path');

// Storage config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${req.user._id}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// File filter (optional: restrict to image files)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb('Only image files are allowed!', false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
