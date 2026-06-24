const express = require('express');
const router = express.Router();
const { getAboutSettings, updateAboutSettings, uploadAboutImage } = require('../controllers/aboutSettingsController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getAboutSettings)
  .put(protect, updateAboutSettings);

router.route('/upload-image')
  .post(protect, upload.single('image'), uploadAboutImage);

module.exports = router;
