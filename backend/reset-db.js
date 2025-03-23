const mongoose = require('mongoose');
require('dotenv').config();
const Candidate = require('./models/Candidate');

// Sample candidate data
const sampleCandidates = [
  {
    id: 'CAN-SAMPLE-574395',
    name: 'John Sample',
    email: 'john.sample@example.com',
    phone: '555-123-4567',
    linkedin: 'https://linkedin.com/in/johnsample',
    summary: 'John demonstrated strong analytical skills during the interview. He articulated his thoughts clearly and showed good problem-solving abilities. His technical knowledge in the required areas was solid.\n\nStrengths:\n- Excellent communication skills\n- Strong problem-solving approach\n- Good understanding of relevant technology',
    recommendations: 'Recommendations for improvement:\n\n1. Work on providing more concise answers to questions. Sometimes responses were too lengthy.\n\n2. Strengthen technical knowledge in specific areas which will be important for this role.\n\n3. Practice discussing specific metrics and outcomes from previous work to better quantify achievements.',
    accessKey: '8b17879f434b7adc',
    isUnlocked: true
  },
  {
    id: 'CAN-SAMPLE-976734',
    name: 'Emma Sample',
    email: 'emma.sample@example.com',
    phone: '555-987-6543',
    linkedin: 'https://linkedin.com/in/emmasample',
    summary: 'Emma showed exceptional leadership qualities and project management experience. She provided concrete examples of past achievements and demonstrated a clear understanding of the role.\n\nStrengths:\n- Strong leadership abilities\n- Excellent project management skills\n- Clear and concise communication',
    recommendations: 'Recommendations for improvement:\n\n1. Develop more detailed responses about technical implementation details.\n\n2. Prepare more specific examples of how you\'ve handled challenges in the past.\n\n3. Research the company\'s products more thoroughly to address how your skills align with specific needs.',
    accessKey: 'c5f3e9b821a6d794',
    isUnlocked: false
  }
];

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/3hire';

// Connect to the database
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Option to delete all candidates or just clear unlock status
      const args = process.argv.slice(2);
      const resetOnly = args.includes('--reset-unlock');
      const addSampleData = args.includes('--add-samples');
      
      if (resetOnly) {
        // Reset the unlock status of all candidates
        const result = await Candidate.updateMany({}, { isUnlocked: false });
        console.log(`Reset unlock status for ${result.modifiedCount} candidate(s)`);
      } else {
        // Delete all candidates
        const result = await Candidate.deleteMany({});
        console.log(`Deleted ${result.deletedCount} candidate(s) from the database`);
        
        // Add sample data if requested
        if (addSampleData || args.length === 0) {
          await Candidate.insertMany(sampleCandidates);
          console.log(`Added ${sampleCandidates.length} sample candidates to the database`);
        }
      }
    } catch (error) {
      console.error('Error during database reset:', error);
    } finally {
      // Close the database connection
      await mongoose.connection.close();
      console.log('Database connection closed');
    }
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });