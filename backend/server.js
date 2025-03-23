const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../')));

// API routes
app.use('/api/candidates', require('./routes/candidates'));
app.use('/api/contact', require('./routes/contact'));

// Catch-all handler for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Database connection
const connectDB = async () => {
  try {
    // Use local MongoDB in development
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/3hire';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected...');
  } catch (err) {
    console.error('Database connection error:', err.message);
    // Exit process with failure
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
