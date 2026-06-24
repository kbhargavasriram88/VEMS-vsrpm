const express = require('express');
const router = express.Router();
const contactSettingsController = require('../controllers/contactSettingsController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', contactSettingsController.getContactSettings);
router.put('/', protect, contactSettingsController.updateContactSettings);
router.post('/upload-image', protect, upload.single('image'), contactSettingsController.uploadContactImage);

module.exports = router;
