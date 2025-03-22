const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs').promises;
const nodemailer = require('nodemailer');

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
    
    // Process paragraphs for summary
    const summaryHtml = (candidate.summary || 'Not provided')
      .split(/\n\s*\n/)
      .map(para => para.replace(/\n/g, '<br>'))
      .join('</p><p>');
    template = template.replace(/{{summary}}/g, summaryHtml);
    
    // Process paragraphs for recommendations
    const recommendationsHtml = (candidate.recommendations || 'Not provided')
      .split(/\n\s*\n/)
      .map(para => para.replace(/\n/g, '<br>'))
      .join('</p><p>');
    template = template.replace(/{{recommendations}}/g, recommendationsHtml);
    
    // Replace new assessment fields
    template = template.replace(/{{timing}}/g, candidate.timing || 'Not provided');
    template = template.replace(/{{facial}}/g, candidate.facial || 'Not provided');
    template = template.replace(/{{video}}/g, candidate.video || 'Not provided');
    template = template.replace(/{{communication}}/g, candidate.communication || 'Not provided');
    
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
    const candidates = await Candidate.find().select('id name accessUrl isUnlocked');
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get candidate by ID, name, email, phone, or LinkedIn
router.get('/:searchTerm', async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm;
    
    // Try to find by ID first
    let candidate = await Candidate.findOne({ id: searchTerm });
    
    // If not found, try other fields
    if (!candidate) {
      candidate = await Candidate.findOne({
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },  // Case insensitive name search
          { email: { $regex: searchTerm, $options: 'i' } }, // Case insensitive email search
          { phone: { $regex: searchTerm, $options: 'i' } }, // Case insensitive phone search
          { linkedin: { $regex: searchTerm, $options: 'i' } } // Case insensitive LinkedIn search
        ]
      });
    }
    
    if (!candidate) return res.status(404).json({ message: 'No candidate found matching: ' + searchTerm });
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

// Verify candidate access key
router.post('/:id/verify', async (req, res) => {
  try {
    const { accessKey } = req.body;
    if (!accessKey) {
      return res.status(400).json({ message: 'Access key is required' });
    }
    
    const candidate = await Candidate.findOne({ id: req.params.id });
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    
    // Verify the access key
    if (candidate.accessKey !== accessKey) {
      return res.status(401).json({ message: 'Invalid access key' });
    }
    
    // Return success if key matches
    res.json({ 
      verified: true, 
      message: 'Access key verified successfully',
      candidateId: candidate.id,
      candidateName: candidate.name
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

// Update unlock status for a candidate
router.post('/:id/unlock', async (req, res) => {
  try {
    console.log(`Attempting to unlock candidate: ${req.params.id}`);
    
    const candidate = await Candidate.findOne({ id: req.params.id });
    if (!candidate) {
      console.log(`Candidate not found: ${req.params.id}`);
      return res.status(404).json({ message: 'Candidate not found' });
    }
    
    console.log(`Found candidate: ${candidate.id}, current unlock status: ${candidate.isUnlocked}`);
    
    // Update isUnlocked status
    const updatedCandidate = await Candidate.findOneAndUpdate(
      { id: req.params.id },
      { isUnlocked: true },
      { new: true }
    );
    
    console.log(`Updated candidate: ${updatedCandidate.id}, new unlock status: ${updatedCandidate.isUnlocked}`);
    
    // Also update the profile HTML file to reflect the unlocked status
    try {
      await generateProfileHtml(updatedCandidate);
      console.log(`Updated profile HTML for candidate: ${updatedCandidate.id}`);
    } catch (htmlErr) {
      console.error('Error updating profile HTML:', htmlErr);
      // Continue even if HTML update fails
    }
    
    res.json({ 
      success: true, 
      message: 'Candidate recommendations unlocked successfully',
      isUnlocked: updatedCandidate.isUnlocked,
      candidateId: updatedCandidate.id
    });
  } catch (err) {
    console.error('Error unlocking candidate:', err);
    res.status(500).json({ message: err.message });
  }
});

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Change to your email service
  auth: {
    user: process.env.EMAIL_USER || '3@threehire.com',  // Use environment variable or default
    pass: process.env.EMAIL_PASSWORD || 'app-password-here'  // Use environment variable (secure)
  }
});

// Send email with report access details
router.post('/:id/emailAccess', async (req, res) => {
  try {
    const { name, email, candidateId, accessKey } = req.body;
    
    if (!email || !candidateId || !accessKey) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const candidate = await Candidate.findOne({ id: req.params.id });
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    
    // Verify the candidate details
    if (candidate.id !== candidateId || candidate.email !== email) {
      return res.status(400).json({ message: 'Candidate information mismatch' });
    }
    
    // Create email content
    const siteUrl = `${req.protocol}://${req.get('host')}`;
    const reportUrl = `${siteUrl}/candidates.html`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER || '3@threehire.com',
      to: email,
      subject: '3Hire: Your Assessment Report is Ready',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #2c3e50; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">3Hire Assessment Report</h1>
          </div>
          
          <div style="padding: 20px; background-color: #f5f5f5;">
            <p>Hello ${name},</p>
            
            <p>Your assessment report is now available. Please use the following information to access your report:</p>
            
            <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Report URL:</strong> <a href="${reportUrl}" target="_blank">${reportUrl}</a></p>
              <p><strong>Candidate ID:</strong> ${candidateId}</p>
              <p><strong>Access Key:</strong> ${accessKey}</p>
            </div>
            
            <p>To view your report, visit the URL above and enter your Candidate ID and Access Key when prompted.</p>
            
            <p>If you have any questions about your assessment or need assistance accessing your report, please contact our team.</p>
            
            <p>Best regards,<br>The 3Hire Team</p>
          </div>
          
          <div style="padding: 10px; text-align: center; font-size: 12px; color: #666;">
            <p>&copy; 2025 3Hire. All rights reserved.</p>
          </div>
        </div>
      `
    };
    
    // Send the email
    await transporter.sendMail(mailOptions);
    
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;