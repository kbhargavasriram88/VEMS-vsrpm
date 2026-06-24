import React, { useState, useEffect } from 'react';
import api from '../services/api';
import SkeletonLoader from '../components/SkeletonLoader';
import HeroSection from '../components/home/HeroSection';
import HighlightsSection from '../components/home/HighlightsSection';
import PrincipalMessage from '../components/home/PrincipalMessage';
import AchievementsSection from '../components/home/AchievementsSection';
import FacilitiesSection from '../components/home/FacilitiesSection';
import NewsEventsSection from '../components/home/NewsEventsSection';
import GalleryTestimonials from '../components/home/GalleryTestimonials';
import AdmissionsBanner from '../components/home/AdmissionsBanner';
const principalImg = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80";
const testimonialImg = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80";
const facSmart = "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80";
const facComputer = "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=600&q=80";
const facScience = "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80";
const facLibrary = "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80";
const facSports = "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80";
const facTransport = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80";

const Home = () => {
  const [settings, setSettings] = useState(null);
  const [admissionsSettings, setAdmissionsSettings] = useState(null);
  const [newsList, setNewsList] = useState([]);
  const [eventList, setEventList] = useState([]);
  const [galleryList, setGalleryList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const [homeRes, adminRes, newsRes, eventsRes, galleryRes] = await Promise.all([
          api.get('/home-settings'),
          api.get('/admissions-settings'),
          api.get('/news'),
          api.get('/events'),
          api.get('/gallery')
        ]);
        setSettings(homeRes.data);
        setAdmissionsSettings(adminRes.data);
        setNewsList(newsRes.data.slice(0, 3));
        setEventList(eventsRes.data.slice(0, 4));
        setGalleryList(galleryRes.data.slice(0, 6));
      } catch (err) {
        console.error('Failed to load homepage data:', err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const fallbackSettings = {
    heroStats: {
      studentsCount: "1500+",
      staffCount: "100+",
      yearsExcellence: "25+"
    },
    achievements: {
      students: "1500+",
      teachers: "85+",
      classrooms: "60+",
      awards: "200+"
    },
    principalMessage: {
      name: "Mr. R. Krishnamurthy",
      designation: "Principal",
      text1: "At Vivekananda E.M High School, we believe in nurturing not just academic excellence, but also values, discipline, and compassion. Our goal is to prepare students to be responsible global citizens and lifelong learners.",
      text2: "Together, let us inspire young minds to dream, achieve and succeed.",
      signature: "R. Krishnamurthy",
      imageUrl: principalImg
    },
    highlights: [
      { icon: "FaGraduationCap", title: "Academic Excellence", description: "Quality education with innovative teaching methodologies." },
      { icon: "FaChalkboardTeacher", title: "Qualified Faculty", description: "Experienced and dedicated teachers committed to student success." },
      { icon: "FaBuilding", title: "Modern Infrastructure", description: "State-of-the-art facilities for a safe and inspiring learning environment." },
      { icon: "FaGlobe", title: "Co-Curricular Activities", description: "Encouraging talents through sports, arts, clubs and competitions." }
    ],
    facilities: [
      { icon: "FaDesktop", title: "Smart Classrooms", imageUrl: facSmart },
      { icon: "FaLaptopCode", title: "Computer Lab", imageUrl: facComputer },
      { icon: "FaFlask", title: "Science Lab", imageUrl: facScience },
      { icon: "FaBookOpen", title: "Library", imageUrl: facLibrary },
      { icon: "FaTrophy", title: "Sports Complex", imageUrl: facSports },
      { icon: "FaBusAlt", title: "Transportation", imageUrl: facTransport }
    ],
    testimonials: [
      { quote: "Vivekananda E.M High School has given my child the perfect blend of education and values. We are proud to be a part of this wonderful institution.", author: "Mrs. Kavitha Reddy", role: "Parent", imageUrl: testimonialImg }
    ],
    welcomeModal: {
      isActive: true,
      announcements: [
        {
          title: "Admissions Open 2025-26",
          description: "Admissions are now open for the upcoming academic year. Apply now to secure your child's future.",
          imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"
        },
        {
          title: "State-of-the-Art Facilities",
          description: "Experience our newly upgraded smart classrooms and modern infrastructure.",
          imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80"
        },
        {
          title: "Annual Sports Meet",
          description: "Join us for the annual sports meet featuring track, field, and team events.",
          imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80"
        }
      ]
    }
  };

  if (isLoading) {
    return <SkeletonLoader />;
  }

  // Use fallback ONLY if the API request failed. 
  // If API succeeds but data is empty (admin deleted it), we respect the empty state.
  const currentSettings = isError || !settings ? fallbackSettings : settings;
  const showNews = currentSettings.newsSection?.isActive !== false;
  const showEvents = currentSettings.eventsSection?.isActive !== false;
  const showGallery = currentSettings.gallerySection?.isActive !== false;

  return (
    <div className="flex flex-col bg-darkBg text-white w-full">
      <HeroSection currentSettings={currentSettings} />
      <HighlightsSection currentSettings={currentSettings} />
      <PrincipalMessage currentSettings={currentSettings} />
      <AchievementsSection currentSettings={currentSettings} />
      <FacilitiesSection currentSettings={currentSettings} />
      <NewsEventsSection 
        currentSettings={currentSettings} 
        newsList={newsList} 
        eventList={eventList} 
        showNews={showNews} 
        showEvents={showEvents} 
      />
      <GalleryTestimonials 
        currentSettings={currentSettings}
        galleryImages={galleryList}
        showGallery={showGallery} 
      />
      <AdmissionsBanner admissionsSettings={admissionsSettings} />
    </div>
  );
};

export default Home;
