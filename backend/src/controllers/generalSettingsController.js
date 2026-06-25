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

const getManifest = async (req, res) => {
  try {
    const settings = await GeneralSettings.findOne();
    const logoUrl = settings?.schoolLogoUrl || '/vite.svg';
    const schoolName = settings?.schoolName || 'Vivekananda E.M High School';
    
    res.json({
      "short_name": "VEMS",
      "name": schoolName,
      "icons": [
        {
          "src": logoUrl,
          "sizes": "192x192 512x512",
          "type": "image/png",
          "purpose": "any maskable"
        }
      ],
      "start_url": "/",
      "display": "standalone",
      "theme_color": "#1E3A8A",
      "background_color": "#0A1128"
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error generating manifest' });
  }
};

module.exports = { getGeneralSettings, updateGeneralSettings, getManifest };
