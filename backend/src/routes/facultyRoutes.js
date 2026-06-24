const express = require('express');
const router = express.Router();
const { getFaculty, createFaculty, deleteFaculty, updateFaculty } = require('../controllers/facultyController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getFaculty)
  .post(protect, upload.single('image'), createFaculty);

router.route('/:id')
  .put(protect, upload.single('image'), updateFaculty)
  .delete(protect, deleteFaculty);

module.exports = router;
