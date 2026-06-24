const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Check if Cloudinary is configured (not using placeholders)
const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_KEY !== 'your_api_key';

let storage;

if (isCloudinaryConfigured) {
  console.log('Using Cloudinary for image storage.');
  const { CloudinaryStorage } = require('multer-storage-cloudinary');
  const cloudinary = require('../config/cloudinary');
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'vivekananda_school',
      allowedFormats: ['jpg', 'png', 'jpeg', 'webp'],
    },
  });
} else {
  console.log('Cloudinary credentials missing or placeholders. Using local disk storage.');
  
  // Ensure the uploads directory exists
  const uploadsDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
}

const multerUpload = multer({ storage });

// Local disk storage specifically for documents (PDFs, etc) to bypass Cloudinary restrictions
const docStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const multerDocUpload = multer({ storage: docStorage });

// Wrapper middleware to adjust path for local storage to be a full web URL
const upload = {
  single: (fieldName) => (req, res, next) => {
    multerUpload.single(fieldName)(req, res, (err) => {
      if (err) return next(err);
      if (req.file && !isCloudinaryConfigured) {
        // Build absolute URL for static local serving
        req.file.path = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      }
      next();
    });
  },
  array: (fieldName, maxCount) => (req, res, next) => {
    multerUpload.array(fieldName, maxCount)(req, res, (err) => {
      if (err) return next(err);
      if (req.files && !isCloudinaryConfigured) {
        req.files.forEach(file => {
          file.path = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
        });
      }
      next();
    });
  },
  singleDoc: (fieldName) => (req, res, next) => {
    multerDocUpload.single(fieldName)(req, res, (err) => {
      if (err) return next(err);
      if (req.file) {
        req.file.path = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      }
      next();
    });
  }
};

module.exports = upload;

