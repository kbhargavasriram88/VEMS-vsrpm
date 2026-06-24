const express = require('express');
const router = express.Router();
const gallerySettingsController = require('../controllers/gallerySettingsController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', gallerySettingsController.getGallerySettings);
router.put('/', protect, gallerySettingsController.updateGallerySettings);
router.post('/upload-image', protect, upload.single('image'), gallerySettingsController.uploadGalleryImage);

module.exports = router;
