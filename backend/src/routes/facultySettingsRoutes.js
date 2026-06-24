const express = require('express');
const router = express.Router();
const facultySettingsController = require('../controllers/facultySettingsController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', facultySettingsController.getFacultySettings);
router.put('/', protect, facultySettingsController.updateFacultySettings);
router.post('/upload-image', protect, upload.single('image'), facultySettingsController.uploadFacultyImage);

module.exports = router;
