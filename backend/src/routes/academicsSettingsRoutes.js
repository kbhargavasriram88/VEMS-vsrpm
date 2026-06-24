const express = require('express');
const router = express.Router();
const { getAcademicsSettings, updateAcademicsSettings, uploadAcademicsImage } = require('../controllers/academicsSettingsController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getAcademicsSettings)
  .put(protect, updateAcademicsSettings);

router.route('/upload-image')
  .post(protect, upload.single('image'), uploadAcademicsImage);

module.exports = router;
