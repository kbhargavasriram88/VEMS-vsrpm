const Faculty = require('../models/Faculty');

// @desc    Get all faculty
// @route   GET /api/faculty
// @access  Public
const getFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find({});
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create new faculty
// @route   POST /api/faculty
// @access  Private/Admin
const createFaculty = async (req, res) => {
  try {
    const { name, designation, department, qualifications, experience, email } = req.body;
    const imageUrl = req.file ? req.file.path : '';

    const faculty = new Faculty({
      name,
      designation,
      department,
      qualifications: qualifications ? qualifications.split(',') : [],
      experience,
      email,
      imageUrl
    });

    const createdFaculty = await faculty.save();
    res.status(201).json(createdFaculty);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const deleteFaculty = async (req, res) => {
  try {
    const member = await Faculty.findById(req.params.id);
    if (member) {
      await Faculty.findByIdAndDelete(req.params.id);
      res.json({ message: 'Faculty member removed' });
    } else {
      res.status(404).json({ message: 'Faculty member not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateFaculty = async (req, res) => {
  try {
    const member = await Faculty.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Faculty member not found' });
    }

    const { name, designation, department, qualifications, experience, email } = req.body;
    
    member.name = name || member.name;
    member.designation = designation || member.designation;
    member.department = department || member.department;
    member.qualifications = qualifications ? qualifications.split(',') : member.qualifications;
    member.experience = experience || member.experience;
    member.email = email || member.email;

    if (req.file) {
      member.imageUrl = req.file.path;
    }

    const updatedMember = await member.save();
    res.json(updatedMember);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getFaculty, createFaculty, deleteFaculty, updateFaculty };
