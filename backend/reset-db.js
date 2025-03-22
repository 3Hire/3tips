const mongoose = require('mongoose');
require('dotenv').config();
const Candidate = require('./models/Candidate');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/candidates_db';

// Connect to the database
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Option to delete all candidates or just clear unlock status
      const args = process.argv.slice(2);
      const resetOnly = args.includes('--reset-unlock');
      
      if (resetOnly) {
        // Reset the unlock status of all candidates
        const result = await Candidate.updateMany({}, { isUnlocked: false });
        console.log(`Reset unlock status for ${result.modifiedCount} candidate(s)`);
      } else {
        // Delete all candidates
        const result = await Candidate.deleteMany({});
        console.log(`Deleted ${result.deletedCount} candidate(s) from the database`);
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