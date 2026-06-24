import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import About from './pages/About';
import Academics from './pages/Academics';
import Admissions from './pages/Admissions';
import Faculty from './pages/Faculty';
import Gallery from './pages/Gallery';
import NewsEvents from './pages/NewsEvents';
import Contact from './pages/Contact';
import EventDetails from './pages/EventDetails';
import AdminDashboard from './pages/AdminDashboard';

import Login from './pages/admin/Login';
import ManageFaculty from './pages/admin/ManageFaculty';
import ManageGallery from './pages/admin/ManageGallery';
import ManageNews from './pages/admin/ManageNews';
import ManageEvents from './pages/admin/ManageEvents';
import ManageAdmissions from './pages/admin/ManageAdmissions';
import ManageAdmissionsContent from './pages/admin/ManageAdmissionsContent';
import ManageContacts from './pages/admin/ManageContacts';
import ManageSettings from './pages/admin/ManageSettings';
import ManageHome from './pages/admin/ManageHome';
import ManageAbout from './pages/admin/ManageAbout';
import ManageAcademics from './pages/admin/ManageAcademics';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/news-events" element={<NewsEvents />} />
          <Route path="/news-events/:id" element={<EventDetails />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        <Route path="/admin/login" element={<Login />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="faculty" element={<ManageFaculty />} />
          <Route path="gallery" element={<ManageGallery />} />
          <Route path="news" element={<ManageNews />} />
          <Route path="events" element={<ManageEvents />} />
          <Route path="admissions" element={<ManageAdmissions />} />
          <Route path="manage-admissions" element={<ManageAdmissionsContent />} />
          <Route path="contact" element={<ManageContacts />} />
          <Route path="home" element={<ManageHome />} />
          <Route path="about" element={<ManageAbout />} />
          <Route path="academics" element={<ManageAcademics />} />
          <Route path="settings" element={<ManageSettings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
