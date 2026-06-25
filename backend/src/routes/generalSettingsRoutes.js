const express = require('express');
const router = express.Router();
const { getGeneralSettings, updateGeneralSettings, getManifest } = require('../controllers/generalSettingsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/manifest.json', getManifest);
router.get('/', getGeneralSettings);
router.put('/', protect, updateGeneralSettings);

module.exports = router;
