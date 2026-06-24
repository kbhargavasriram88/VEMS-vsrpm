const express = require('express');
const router = express.Router();
const { getAdmissionsSettings, updateAdmissionsSettings } = require('../controllers/admissionsSettingsController');

router.route('/')
  .get(getAdmissionsSettings)
  .put(updateAdmissionsSettings);

module.exports = router;
