async function runTests() {
  console.log('--- Phase 1: Testing Public Form Submissions ---');
  try {
    // 1. Test Admissions Inquiry
    console.log('Testing Admissions Form Submission...');
    const admissionRes = await fetch('http://localhost:5000/api/admissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentName: 'Test Student',
        parentName: 'Test Parent',
        phone: '1234567890',
        email: 'test@example.com',
        gradeApplyingFor: 'Class I',
        dob: '2015-01-01',
        address: '123 Test Street'
      })
    });
    const text = await admissionRes.text();
    console.log('Admissions Submission Success:', admissionRes.status === 201, text);
  } catch (err) {
    console.error('Admissions Submission Failed:', err.message);
  }

  try {
    // 2. Test Contact Form
    console.log('Testing Contact Form Submission...');
    const contactRes = await fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Automated Test Message',
        message: 'This is an automated test message to verify the contact form.'
      })
    });
    console.log('Contact Submission Success:', contactRes.status === 201);
  } catch (err) {
    console.error('Contact Submission Failed:', err.message);
  }
}

runTests();
