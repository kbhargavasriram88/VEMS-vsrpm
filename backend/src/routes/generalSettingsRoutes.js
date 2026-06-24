const express = require('express');
const router = express.Router();
const { getGeneralSettings, updateGeneralSettings } = require('../controllers/generalSettingsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getGeneralSettings);
router.put('/', protect, updateGeneralSettings);

module.exports = router;
