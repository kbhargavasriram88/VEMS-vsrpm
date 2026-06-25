const Gallery = require('../models/Gallery');
const cloudinary = require('../config/cloudinary');

const getGallery = async (req, res) => {
  try {
    const gallery = await Gallery.find({}).sort({ sortOrder: 1, createdAt: -1 });
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const createGalleryImage = async (req, res) => {
  try {
    const { title, category, sortOrder } = req.body;
    if (!req.file) return res.status(400).json({ message: 'No image provided' });

    const gallery = await Gallery.create({
      title,
      category,
      sortOrder: sortOrder ? parseInt(sortOrder) : 0,
      imageUrl: req.file.path,
      publicId: req.file.filename
    });
    res.status(201).json(gallery);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateGalleryImage = async (req, res) => {
  try {
    const { title, category, sortOrder } = req.body;
    const item = await Gallery.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Image not found' });
    }

    item.title = title || item.title;
    item.category = category || item.category;
    item.sortOrder = sortOrder !== undefined ? parseInt(sortOrder) : item.sortOrder;

    // If a new image is uploaded, we replace the old one
    if (req.file) {
      // Destroy old image on cloudinary
      if (item.publicId) {
        try {
          await cloudinary.uploader.destroy(item.publicId);
        } catch (err) {
          console.error('Failed to delete old image from Cloudinary:', err);
        }
      }
      item.imageUrl = req.file.path;
      item.publicId = req.file.filename;
    }

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const deleteGalleryImage = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Image not found' });
    }

    if (item.publicId) {
      try {
        await cloudinary.uploader.destroy(item.publicId);
      } catch (err) {
        console.error('Failed to delete from Cloudinary:', err);
      }
    }

    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getGallery, createGalleryImage, updateGalleryImage, deleteGalleryImage };
