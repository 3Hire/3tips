const fs = require('fs');
const path = require('path');

// Sample candidate data
const sampleCandidate = {
  id: "CAN-SAMPLE",
  name: "Jane Smith",
  email: "jane.smith@example.com",
  phone: "555-123-4567",
  linkedin: "https://linkedin.com/in/jane-smith-sample",
  summary: "Experienced software developer with expertise in full-stack development and cloud technologies.",
  strengths: ["Problem solving", "Technical communication", "Team leadership"],
  weaknesses: ["Could improve time management", "Sometimes focuses too much on details"],
  skills: ["JavaScript", "React", "Node.js", "MongoDB", "AWS"]
};

// Generate a random access key (16 characters)
function generateAccessKey() {
  return Math.random().toString(16).substring(2, 10) + 
         Math.random().toString(16).substring(2, 10);
}

// Generate the URL
function generateAccessUrl(candidateId, accessKey) {
  return `profile-${candidateId}-${accessKey}.html`;
}

// Create a profile HTML file
function createProfileHtml(candidate) {
  // Read the template
  const templatePath = path.join(__dirname, 'profile-template.html');
  let template = fs.readFileSync(templatePath, 'utf8');
  
  // Replace placeholders with candidate data
  template = template.replace(/{{id}}/g, candidate.id);
  template = template.replace(/{{name}}/g, candidate.name);
  template = template.replace(/{{email}}/g, candidate.email);
  template = template.replace(/{{phone}}/g, candidate.phone || 'Not provided');
  template = template.replace(/{{linkedin}}/g, candidate.linkedin 
    ? `<a href="${candidate.linkedin}" target="_blank">${candidate.linkedin}</a>` 
    : 'Not provided');
  template = template.replace(/{{summary}}/g, candidate.summary || 'Not provided');
  
  // Handle arrays
  const strengthsList = candidate.strengths && candidate.strengths.length 
    ? candidate.strengths.map(s => `<li>${s}</li>`).join('') 
    : '<li>No strengths listed</li>';
  template = template.replace(/{{strengths}}/g, strengthsList);
  
  const weaknessesList = candidate.weaknesses && candidate.weaknesses.length 
    ? candidate.weaknesses.map(w => `<li>${w}</li>`).join('') 
    : '<li>No areas for improvement listed</li>';
  template = template.replace(/{{weaknesses}}/g, weaknessesList);
  
  const skillsList = candidate.skills && candidate.skills.length 
    ? candidate.skills.map(s => `<li>${s}</li>`).join('') 
    : '<li>No skills listed</li>';
  template = template.replace(/{{skills}}/g, skillsList);
  
  // Generate the access key and URL
  const accessKey = generateAccessKey();
  const accessUrl = generateAccessUrl(candidate.id, accessKey);
  
  // Write the file
  const outputPath = path.join(__dirname, accessUrl);
  fs.writeFileSync(outputPath, template);
  
  return { accessKey, accessUrl };
}

// Create the sample candidate
console.log('Creating sample candidate profile...');
const { accessKey, accessUrl } = createProfileHtml(sampleCandidate);

console.log('-----------------------------------------');
console.log('Sample Candidate Profile Created!');
console.log('-----------------------------------------');
console.log(`Name: ${sampleCandidate.name}`);
console.log(`ID: ${sampleCandidate.id}`);
console.log(`Access Key: ${accessKey}`);
console.log(`Access URL: ${accessUrl}`);
console.log(`Full URL: http://localhost:3000/${accessUrl}`);
console.log('-----------------------------------------');
console.log('You can now access this profile at the URL above');
console.log('-----------------------------------------');