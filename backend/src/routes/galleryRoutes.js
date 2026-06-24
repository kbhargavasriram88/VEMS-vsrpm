const express = require('express');
const router = express.Router();
const { getGallery, createGalleryImage, deleteGalleryImage } = require('../controllers/galleryController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getGallery)
  .post(protect, upload.single('image'), createGalleryImage);

router.route('/:id')
  .delete(protect, deleteGalleryImage);

module.exports = router;
