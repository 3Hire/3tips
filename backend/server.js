const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

// Import routes
const candidateRoutes = require('./routes/candidates');
const contactRoutes = require('./routes/contact');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/candidates_db';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Routes
app.use('/api/candidates', candidateRoutes);
app.use('/api/contact', contactRoutes);

// Serve static files from the parent directory
app.use(express.static(path.join(__dirname, '..')));

// Add a fallback route for SPA routing
app.get('*', (req, res) => {
  // Skip API routes
  if (req.url.startsWith('/api/')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }
  // Send the main index.html for all other routes
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});