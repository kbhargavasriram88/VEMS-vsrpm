const express = require('express');
const router = express.Router();
const newsSettingsController = require('../controllers/newsSettingsController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', newsSettingsController.getNewsSettings);
router.put('/', protect, newsSettingsController.updateNewsSettings);
router.post('/upload-image', protect, upload.single('image'), newsSettingsController.uploadNewsImage);

module.exports = router;
