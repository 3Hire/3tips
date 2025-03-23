const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');

// Get all candidates
router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.find().select('id name email updatedAt').sort('-updatedAt');
    res.json(candidates);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Search candidates
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ msg: 'Search query required' });
    }

    // Search across multiple fields
    const candidates = await Candidate.find({
      $or: [
        { id: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } },
        { linkedin: { $regex: query, $options: 'i' } }
      ]
    }).select('id name email');

    res.json(candidates);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get candidate by ID
router.get('/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ id: req.params.id });
    
    if (!candidate) {
      return res.status(404).json({ msg: 'Candidate not found' });
    }

    res.json(candidate);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create a new candidate
router.post('/', async (req, res) => {
  try {
    // Generate an ID if none provided
    if (!req.body.id) {
      req.body.id = 'CAN-' + Math.floor(100000 + Math.random() * 900000);
    }

    // Create new candidate instance
    const candidate = new Candidate(req.body);
    await candidate.save();
    
    res.json(candidate);
  } catch (err) {
    console.error(err.message);
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Duplicate entry: A candidate with this information already exists' });
    }
    res.status(500).send('Server Error');
  }
});

// Update a candidate
router.put('/:id', async (req, res) => {
  try {
    let candidate = await Candidate.findOne({ id: req.params.id });
    
    if (!candidate) {
      return res.status(404).json({ msg: 'Candidate not found' });
    }

    // Update candidate fields
    const updateData = { ...req.body, updatedAt: Date.now() };
    delete updateData.id; // Don't allow ID to be updated
    
    candidate = await Candidate.findOneAndUpdate(
      { id: req.params.id }, 
      { $set: updateData }, 
      { new: true }
    );

    res.json(candidate);
  } catch (err) {
    console.error(err.message);
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Duplicate entry: A candidate with this information already exists' });
    }
    res.status(500).send('Server Error');
  }
});

// Delete a candidate
router.delete('/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ id: req.params.id });
    
    if (!candidate) {
      return res.status(404).json({ msg: 'Candidate not found' });
    }

    await Candidate.findOneAndDelete({ id: req.params.id });
    res.json({ msg: 'Candidate removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Verify access key for a candidate
router.post('/:id/verify', async (req, res) => {
  try {
    const { accessKey } = req.body;
    if (!accessKey) {
      return res.status(400).json({ msg: 'Access key required' });
    }

    const candidate = await Candidate.findOne({ id: req.params.id });
    if (!candidate) {
      return res.status(404).json({ msg: 'Candidate not found' });
    }

    if (candidate.accessKey !== accessKey) {
      return res.status(401).json({ msg: 'Invalid access key' });
    }

    res.json({ msg: 'Access granted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Unlock recommendations for a candidate
router.post('/:id/unlock', async (req, res) => {
  try {
    const candidate = await Candidate.findOneAndUpdate(
      { id: req.params.id },
      { $set: { isUnlocked: true } },
      { new: true }
    );
    
    if (!candidate) {
      return res.status(404).json({ msg: 'Candidate not found' });
    }

    res.json(candidate);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
