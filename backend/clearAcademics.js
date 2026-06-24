require('dotenv').config();
const mongoose = require('mongoose');
const AcademicsSettings = require('./src/models/AcademicsSettings');

const clearDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
    
    await AcademicsSettings.deleteMany({});
    console.log('AcademicsSettings cleared. The controller will recreate it with the correct defaults on the next fetch.');
    
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

clearDb();
