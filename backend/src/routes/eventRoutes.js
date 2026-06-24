const express = require('express');
const router = express.Router();
const { getEvents, getEventById, createEvent, deleteEvent } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getEvents)
  .post(protect, upload.single('image'), createEvent);

router.route('/:id')
  .get(getEventById)
  .delete(protect, deleteEvent);

module.exports = router;
