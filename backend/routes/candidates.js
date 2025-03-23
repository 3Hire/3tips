const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');

// Get all candidates
router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.findAll();
    
    // Sort by updatedAt descending and select fields
    const sortedCandidates = candidates
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .map(({ id, name, email, updatedAt }) => ({ id, name, email, updatedAt }));
    
    res.json(sortedCandidates);
  } catch (err) {
    console.error(err);
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

    const candidates = await Candidate.search(query);
    
    // Just return basic info for the search results
    const results = candidates.map(c => ({
      id: c.id,
      name: c.name,
      email: c.email
    }));
    
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get candidate by ID
router.get('/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    
    if (!candidate) {
      return res.status(404).json({ msg: 'Candidate not found' });
    }

    res.json(candidate);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Create a new candidate
router.post('/', async (req, res) => {
  try {
    const candidate = await Candidate.create(req.body);
    res.json(candidate);
  } catch (err) {
    console.error(err);
    if (err.code === 'ConditionalCheckFailedException') {
      return res.status(400).json({ msg: 'Duplicate entry: A candidate with this information already exists' });
    }
    res.status(500).send('Server Error');
  }
});

// Update a candidate
router.put('/:id', async (req, res) => {
  try {
    // Check if candidate exists
    const candidate = await Candidate.findById(req.params.id);
    
    if (!candidate) {
      return res.status(404).json({ msg: 'Candidate not found' });
    }

    // Update the candidate
    const updatedCandidate = await Candidate.update(req.params.id, req.body);
    
    res.json(updatedCandidate);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Delete a candidate
router.delete('/:id', async (req, res) => {
  try {
    // Check if candidate exists
    const candidate = await Candidate.findById(req.params.id);
    
    if (!candidate) {
      return res.status(404).json({ msg: 'Candidate not found' });
    }

    await Candidate.delete(req.params.id);
    res.json({ msg: 'Candidate removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Unlock recommendations for a candidate
router.post('/:id/unlock', async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    
    if (!candidate) {
      return res.status(404).json({ msg: 'Candidate not found' });
    }
    
    const updatedCandidate = await Candidate.unlock(req.params.id);
    res.json(updatedCandidate);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Verify access key for a candidate
router.post('/:id/verify', async (req, res) => {
  try {
    const { accessCode } = req.body;
    if (!accessCode) {
      return res.status(400).json({ msg: 'Access code required' });
    }

    const candidate = await Candidate.findById(req.params.id);
    
    if (!candidate) {
      return res.status(404).json({ msg: 'Candidate not found' });
    }

    if (candidate.accessCode !== accessCode) {
      return res.status(401).json({ msg: 'Invalid access code' });
    }

    res.json({ msg: 'Access granted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;