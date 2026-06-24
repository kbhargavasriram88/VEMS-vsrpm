const express = require('express');
const router = express.Router();
const { getNews, createNews, deleteNews } = require('../controllers/newsController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getNews)
  .post(protect, upload.single('image'), createNews);

router.route('/:id')
  .delete(protect, deleteNews);

module.exports = router;
