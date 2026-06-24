const express = require('express');
const router = express.Router();
const { submitContactMessage, getContactMessages, deleteContactMessage } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(submitContactMessage)
  .get(protect, getContactMessages);

router.route('/:id')
  .delete(protect, deleteContactMessage);

module.exports = router;
