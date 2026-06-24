const express = require('express');
const router = express.Router();
const { submitInquiry, getInquiries, updateInquiryStatus, deleteInquiry } = require('../controllers/admissionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(submitInquiry)
  .get(protect, getInquiries);

router.route('/:id')
  .delete(protect, deleteInquiry);

router.route('/:id/status')
  .put(protect, updateInquiryStatus);

module.exports = router;
