const AdmissionInquiry = require('../models/AdmissionInquiry');

const submitInquiry = async (req, res) => {
  try {
    const inquiry = await AdmissionInquiry.create(req.body);
    res.status(201).json(inquiry);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getInquiries = async (req, res) => {
  try {
    const inquiries = await AdmissionInquiry.find({}).sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateInquiryStatus = async (req, res) => {
  try {
    const inquiry = await AdmissionInquiry.findById(req.params.id);
    if (inquiry) {
      inquiry.status = req.body.status || inquiry.status;
      const updatedInquiry = await inquiry.save();
      res.json(updatedInquiry);
    } else {
      res.status(404).json({ message: 'Inquiry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await AdmissionInquiry.findById(req.params.id);
    if (inquiry) {
      await AdmissionInquiry.findByIdAndDelete(req.params.id);
      res.json({ message: 'Inquiry removed' });
    } else {
      res.status(404).json({ message: 'Inquiry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { submitInquiry, getInquiries, updateInquiryStatus, deleteInquiry };
