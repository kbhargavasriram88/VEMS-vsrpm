const express = require('express');
const router = express.Router();
const { getHomeSettings, updateHomeSettings, uploadHomeImage } = require('../controllers/homeSettingsController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getHomeSettings)
  .put(protect, updateHomeSettings);

router.route('/upload-image')
  .post(protect, upload.single('image'), uploadHomeImage);

router.route('/upload-doc')
  .post(protect, upload.singleDoc('doc'), uploadHomeImage);

module.exports = router;

