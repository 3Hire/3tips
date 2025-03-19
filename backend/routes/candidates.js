const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs').promises;

// Generate random access key - 16 characters
function generateAccessKey() {
  return crypto.randomBytes(8).toString('hex');
}

// Generate URL path
function generateAccessUrl(candidateId, accessKey) {
  return `profile-${candidateId}-${accessKey}.html`;
}

// Generate shareable profile HTML
async function generateProfileHtml(candidate) {
  const templatePath = path.join(__dirname, '../..', 'profile-template.html');
  try {
    let template = await fs.readFile(templatePath, 'utf8');
    
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
    
    // Save the generated HTML file
    const outputPath = path.join(__dirname, '../..', candidate.accessUrl);
    await fs.writeFile(outputPath, template);
    
    return candidate.accessUrl;
  } catch (err) {
    console.error('Error generating profile HTML:', err);
    throw err;
  }
}

// Get all candidates (simplified list for dropdown/selection)
router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.find().select('id name accessUrl');
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get candidate by ID
router.get('/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ id: req.params.id });
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new candidate
router.post('/', async (req, res) => {
  try {
    // Generate accessKey and accessUrl
    const accessKey = generateAccessKey();
    const candidateData = {
      ...req.body,
      accessKey,
      accessUrl: generateAccessUrl(req.body.id, accessKey)
    };
    
    const candidate = new Candidate(candidateData);
    const newCandidate = await candidate.save();
    
    // Generate shareable HTML profile page
    await generateProfileHtml(newCandidate);
    
    res.status(201).json(newCandidate);
  } catch (err) {
    // Handle duplicate key errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(409).json({ 
        message: `Duplicate key error: ${field} already exists in the database.`,
        field 
      });
    }
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: `Validation failed: ${errors.join(', ')}` });
    }
    
    res.status(400).json({ message: err.message });
  }
});

// Update candidate
router.put('/:id', async (req, res) => {
  try {
    // Find the candidate first
    const existingCandidate = await Candidate.findOne({ id: req.params.id });
    if (!existingCandidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    
    // Update using the existing accessKey
    const candidate = await Candidate.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { 
        new: true,
        runValidators: true
      }
    );
    
    // Re-generate the profile HTML
    await generateProfileHtml(candidate);
    
    res.json(candidate);
  } catch (err) {
    // Handle duplicate key errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(409).json({ 
        message: `Duplicate key error: ${field} already exists in the database.`,
        field 
      });
    }
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: `Validation failed: ${errors.join(', ')}` });
    }
    
    res.status(400).json({ message: err.message });
  }
});

// Delete candidate
router.delete('/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ id: req.params.id });
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    
    // Get the profile page path before deleting the candidate
    const profilePath = path.join(__dirname, '../..', candidate.accessUrl);
    
    // Delete the candidate from the database
    await Candidate.deleteOne({ id: req.params.id });
    
    // Try to delete the HTML file
    try {
      await fs.unlink(profilePath);
    } catch (fileErr) {
      console.error('Error deleting profile file:', fileErr);
      // Continue even if file deletion fails
    }
    
    res.json({ message: 'Candidate deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get shareable URL for a candidate
router.get('/:id/shareableUrl', async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ id: req.params.id });
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    
    res.json({ 
      url: candidate.accessUrl,
      fullUrl: `${req.protocol}://${req.get('host')}/${candidate.accessUrl}`
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Regenerate access key and URL for a candidate
router.post('/:id/regenerateAccess', async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ id: req.params.id });
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    
    // Delete old profile page
    try {
      const oldProfilePath = path.join(__dirname, '../..', candidate.accessUrl);
      await fs.unlink(oldProfilePath);
    } catch (fileErr) {
      console.error('Error deleting old profile file:', fileErr);
      // Continue even if file deletion fails
    }
    
    // Generate new access key and URL
    const accessKey = generateAccessKey();
    const accessUrl = generateAccessUrl(candidate.id, accessKey);
    
    // Update candidate
    const updatedCandidate = await Candidate.findOneAndUpdate(
      { id: req.params.id },
      { accessKey, accessUrl },
      { new: true }
    );
    
    // Generate new profile HTML
    await generateProfileHtml(updatedCandidate);
    
    res.json({ 
      url: updatedCandidate.accessUrl,
      fullUrl: `${req.protocol}://${req.get('host')}/${updatedCandidate.accessUrl}`
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;