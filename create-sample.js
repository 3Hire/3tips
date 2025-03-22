const axios = require('axios');
const crypto = require('crypto');

// Sample candidate data
const sampleCandidate = {
  id: "CAN-SAMPLE-" + Math.floor(100000 + Math.random() * 900000), // Random ID
  name: "Jane Smith",
  email: "jane.smith@example.com",
  phone: "555-123-4567",
  linkedin: "https://linkedin.com/in/jane-smith-sample",
  summary: "Experienced software developer with expertise in full-stack development and cloud technologies.\n\nDemonstrates excellent problem-solving skills and communicates technical concepts clearly.\n\nWorks well with cross-functional teams and has a strong foundation in modern web technologies.",
  recommendations: "Focus on improving public speaking skills through regular practice with technical presentations.\n\nConsider obtaining cloud certification to formalize existing knowledge in AWS or similar platforms.\n\nContinue developing leadership capabilities by mentoring junior developers.",
  timing: "Responds to questions promptly with well-structured answers.",
  facial: "Maintains good eye contact and presents with confidence.",
  video: "Professional appearance and environment during video sessions.",
  communication: "Articulates ideas clearly and adapts explanations based on audience.",
  isUnlocked: false
};

// Create a sample candidate in the database
async function createSampleCandidate(candidate) {
  try {
    // API endpoint
    const apiUrl = 'http://localhost:3000/api/candidates';
    
    // Post to API
    const response = await axios.post(apiUrl, candidate);
    
    return response.data;
  } catch (error) {
    console.error('Error creating sample candidate:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Display candidate info in a formatted way
function displayCandidateInfo(candidate) {
  console.log('-----------------------------------------');
  console.log('Sample Candidate Created in Database!');
  console.log('-----------------------------------------');
  console.log(`Name: ${candidate.name}`);
  console.log(`ID: ${candidate.id}`);
  console.log(`Access Key: ${candidate.accessKey}`);
  console.log('-----------------------------------------');
  console.log('Access Information:');
  console.log(`Candidate URL: http://localhost:3000/candidates.html`);
  console.log(`Candidate ID: ${candidate.id}`);
  console.log(`Access Code: ${candidate.accessKey}`);
  console.log('-----------------------------------------');
  console.log('You can now access this candidate using the details above');
  console.log('-----------------------------------------');
}

// Create the sample candidate
console.log('Creating sample candidate in database...');

createSampleCandidate(sampleCandidate)
  .then(newCandidate => {
    displayCandidateInfo(newCandidate);
  })
  .catch(error => {
    console.error('Failed to create sample candidate:', error);
    console.log('\nIs your backend server running? Try starting it with:');
    console.log('cd backend && npm start');
  });