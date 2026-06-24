require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./src/config/db');
const { errorHandler } = require('./src/middleware/errorMiddleware');

// Routes
const authRoutes = require('./src/routes/authRoutes');
const facultyRoutes = require('./src/routes/facultyRoutes');
const newsRoutes = require('./src/routes/newsRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const galleryRoutes = require('./src/routes/galleryRoutes');
const admissionRoutes = require('./src/routes/admissionRoutes');
const contactRoutes = require('./src/routes/contactRoutes');
const homeSettingsRoutes = require('./src/routes/homeSettingsRoutes');
const aboutSettingsRoutes = require('./src/routes/aboutSettingsRoutes');
const academicsSettingsRoutes = require('./src/routes/academicsSettingsRoutes');
const admissionsSettingsRoutes = require('./src/routes/admissionsSettingsRoutes');
const facultySettingsRoutes = require('./src/routes/facultySettingsRoutes');
const gallerySettingsRoutes = require('./src/routes/gallerySettingsRoutes');
const contactSettingsRoutes = require('./src/routes/contactSettingsRoutes');
const newsSettingsRoutes = require('./src/routes/newsSettingsRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const generalSettingsRoutes = require('./src/routes/generalSettingsRoutes');
const dbCheck = require('./src/middleware/dbCheckMiddleware');

// Connect to database
connectDB();

const app = express();
const path = require('path');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan('dev'));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

// Database Check Middleware for all API routes
app.use('/api', dbCheck);

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/home-settings', homeSettingsRoutes);
app.use('/api/about-settings', aboutSettingsRoutes);
app.use('/api/academics-settings', academicsSettingsRoutes);
app.use('/api/admissions-settings', admissionsSettingsRoutes);
app.use('/api/faculty-settings', facultySettingsRoutes);
app.use('/api/gallery-settings', gallerySettingsRoutes);
app.use('/api/contact-settings', contactSettingsRoutes);
app.use('/api/news-settings', newsSettingsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/general-settings', generalSettingsRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
