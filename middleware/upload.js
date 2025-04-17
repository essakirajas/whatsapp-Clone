const multer = require('multer');
const path = require('path');

// Set up storage engine for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Store images in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const allowedExtensions = /jpeg|jpg|png/;
    const ext = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    if (!ext) {
      return cb(new Error('Only images (jpeg, jpg, png) are allowed!'));
    }
    cb(null, true);
  }
});

module.exports = upload;
