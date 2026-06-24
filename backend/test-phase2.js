async function runPhase2() {
  console.log('--- Phase 2: Testing Admin Content Management APIs ---');

  // Login first
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@gmail.com', password: 'admin123' })
  });
  const loginData = await loginRes.json();
  const token = loginData.token;

  // Helper to fetch
  const updateContent = async (url, data) => {
    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(data)
      });
      if (res.status !== 200) {
        console.log(`Failed to update ${url}. Status: ${res.status}. Text: ${await res.text()}`);
      }
      return res.status === 200;
    } catch (err) {
      console.error(`Error updating ${url}:`, err.message);
      return false;
    }
  };

  const fetchContent = async (url) => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      return data;
    } catch (err) {
      console.error(`Error fetching ${url}:`, err.message);
      return null;
    }
  };

  // 1. Toggle Admissions
  console.log('Testing Toggle Admissions Open/Close...');
  const admsSuccess = await updateContent('http://localhost:5000/api/admissions-settings', { admissionsOpen: false });
  const admsData = await fetchContent('http://localhost:5000/api/admissions-settings');
  console.log('Admissions Toggle Success:', admsSuccess, admsData);

  // Re-open
  await updateContent('http://localhost:5000/api/admissions-settings', { admissionsOpen: true });

  // 2. Update Home Settings
  console.log('Testing Update Home Settings...');
  const homeSuccess = await updateContent('http://localhost:5000/api/home-settings', {
    heroBackgroundImage: 'http://test.com',
    heroStats: { studentsCount: '2000+', staffCount: '150+', yearsExcellence: '30+' },
    achievements: { students: '2000+', teachers: '150+', classrooms: '100+', awards: '300+' },
    principalMessage: { name: 'Test Principal', designation: 'Test', text1: 'test', text2: 'test', signature: 'test', imageUrl: 'http://test.com' }
  });
  const homeData = await fetchContent('http://localhost:5000/api/home-settings');
  console.log('Home Settings Update Success:', homeSuccess && homeData.heroStats.studentsCount === '2000+');

  // 3. Update About Page
  console.log('Testing Update About Page...');
  const aboutSuccess = await updateContent('http://localhost:5000/api/about-settings', {
    hero: { backgroundImage: 'http://test.com', title: 'Test About', subtitle: 'Test' },
    visionMission: { vision: 'Test Vision', mission: 'Test Mission', coreValues: ['Value1'] },
    history: { title: 'History', content: 'Test History', image: 'http://test.com' }
  });
  const aboutData = await fetchContent('http://localhost:5000/api/about-settings');
  console.log('About Update Success:', aboutSuccess && aboutData.visionMission.vision === 'Test Vision');

  // 4. Update Academics Page
  console.log('Testing Update Academics Page...');
  const acadSuccess = await updateContent('http://localhost:5000/api/academics-settings', {
    hero: { backgroundImage: 'http://test.com', title: 'Test Acad', subtitle: 'Test' },
    curriculum: { primary: { title: 'Primary', description: 'Test', subjects: ['Math'] }, middle: { title: 'Middle', description: 'Test', subjects: ['Math'] }, high: { title: 'High', description: 'Test', subjects: ['Math'] } }
  });
  const acadData = await fetchContent('http://localhost:5000/api/academics-settings');
  console.log('Academics Update Success:', acadSuccess && acadData.curriculum.primary.title === 'Primary');
}

runPhase2();
