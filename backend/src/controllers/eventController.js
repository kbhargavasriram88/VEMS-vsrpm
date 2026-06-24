const Event = require('../models/Event');

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await Event.find({}).sort({ startDate: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const createEvent = async (req, res) => {
  try {
    const { title, description, startDate, endDate, location } = req.body;
    const imageUrl = req.file ? req.file.path : '';
    const event = await Event.create({ title, description, startDate, endDate, location, imageUrl });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      await Event.findByIdAndDelete(req.params.id);
      res.json({ message: 'Event removed' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getEvents, getEventById, createEvent, deleteEvent };
