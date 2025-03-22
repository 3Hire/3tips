const axios = require('axios');
const crypto = require('crypto');

// Generate a random suffix for unique fields
const randomSuffix = Math.floor(100000 + Math.random() * 900000);

// Sample candidate data
const sampleCandidate = {
  id: "CAN-SAMPLE-" + randomSuffix, // Random ID
  name: "Jane Smith " + randomSuffix,
  email: `jane.smith.${randomSuffix}@example.com`,
  phone: `555-123-${randomSuffix.toString().substring(0, 4)}`,
  linkedin: `https://linkedin.com/in/jane-smith-sample-${randomSuffix}`,
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
    // Dynamically determine API base URL based on current domain
    const getApiBaseUrl = () => {
      if (typeof window !== 'undefined') {
        // Browser environment
        const protocol = window.location.protocol;
        const hostname = window.location.hostname;
        const port = (hostname === 'localhost' || hostname === '127.0.0.1') ? ':3000' : '';
        return `${protocol}//${hostname}${port}/api/candidates`;
      } else {
        // Node.js environment
        // Default is localhost, but could be overridden by environment variables
        // In production this could be 3hire.ai or www.3hire.ai
        const hostname = process.env.API_HOST || 'localhost';
        const port = (hostname === 'localhost' || hostname === '127.0.0.1') ? ':3000' : '';
        const protocol = port ? 'http' : 'https';
        return `${protocol}://${hostname}${port}/api/candidates`;
      }
    };
    
    const apiUrl = getApiBaseUrl();
    console.log('Using API URL:', apiUrl);
    
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
  console.log(`Candidate URL: ${process.env.PUBLIC_URL || 'http://localhost:3000'}/candidates.html`);
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