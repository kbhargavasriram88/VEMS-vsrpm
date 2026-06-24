const GeneralSettings = require('../models/GeneralSettings');

const getGeneralSettings = async (req, res) => {
  try {
    let settings = await GeneralSettings.findOne();
    if (!settings) {
      settings = await GeneralSettings.create({});
    }
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching general settings' });
  }
};

const updateGeneralSettings = async (req, res) => {
  try {
    let settings = await GeneralSettings.findOne();
    if (settings) {
      settings = await GeneralSettings.findOneAndUpdate({}, req.body, { new: true });
    } else {
      settings = await GeneralSettings.create(req.body);
    }
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error updating general settings' });
  }
};

module.exports = { getGeneralSettings, updateGeneralSettings };
