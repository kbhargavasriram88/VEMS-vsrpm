const ContactSettings = require('../models/ContactSettings');

exports.getContactSettings = async (req, res) => {
  try {
    let settings = await ContactSettings.findOne();
    if (!settings) {
      settings = await ContactSettings.create({
        hero: {
          backgroundImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80",
          sideImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80"
        }
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.updateContactSettings = async (req, res) => {
  try {
    let settings = await ContactSettings.findOne();
    if (settings) {
      settings.hero = req.body.hero || settings.hero;
      const updatedSettings = await settings.save();
      res.json(updatedSettings);
    } else {
      const newSettings = await ContactSettings.create(req.body);
      res.status(201).json(newSettings);
    }
  } catch (error) {
    res.status(400).json({ message: 'Failed to update settings', error: error.message });
  }
};

exports.uploadContactImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    
    // Convert to relative URL for frontend
    const imageUrl = req.file.path;
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload image', error: error.message });
  }
};
