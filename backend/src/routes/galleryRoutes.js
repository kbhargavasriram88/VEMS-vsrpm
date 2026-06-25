const express = require('express');
const router = express.Router();
const { getGallery, createGalleryImage, updateGalleryImage, deleteGalleryImage } = require('../controllers/galleryController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getGallery)
  .post(protect, upload.single('image'), createGalleryImage);

router.route('/:id')
  .put(protect, upload.single('image'), updateGalleryImage)
  .delete(protect, deleteGalleryImage);

module.exports = router;
