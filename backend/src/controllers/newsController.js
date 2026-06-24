const News = require('../models/News');

const getNews = async (req, res) => {
  try {
    const news = await News.find({}).sort({ publishedDate: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const createNews = async (req, res) => {
  try {
    const { title, content, isActive } = req.body;
    const imageUrl = req.file ? req.file.path : '';
    const news = await News.create({ title, content, imageUrl, isActive });
    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const deleteNews = async (req, res) => {
  try {
    const item = await News.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'News article not found' });
    }
    await News.findByIdAndDelete(req.params.id);
    res.json({ message: 'News article removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getNews, createNews, deleteNews };
