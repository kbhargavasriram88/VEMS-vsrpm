const ContactMessage = require('../models/ContactMessage');

const submitContactMessage = async (req, res) => {
  try {
    const message = await ContactMessage.create(req.body);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const deleteContactMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (message) {
      await ContactMessage.findByIdAndDelete(req.params.id);
      res.json({ message: 'Message removed' });
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { submitContactMessage, getContactMessages, deleteContactMessage };
