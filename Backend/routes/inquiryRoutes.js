const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');

// Create a new inquiry
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: 'Missing fields' });
    const inquiry = new Inquiry({ name, email, message });
    await inquiry.save();
    return res.json({ success: true, inquiry });
  } catch (err) {
    console.error('inquiry create error', err);
    return res.status(500).json({ error: 'Failed to create inquiry' });
  }
});

// List inquiries (admin)
router.get('/', async (req, res) => {
  try {
    const items = await Inquiry.find().sort({ createdAt: -1 }).limit(200);
    return res.json({ success: true, inquiries: items });
  } catch (err) {
    console.error('inquiry list error', err);
    return res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

// Mark resolved
router.post('/:id/resolve', async (req, res) => {
  try {
    const { id } = req.params;
    await Inquiry.findByIdAndUpdate(id, { resolved: true });
    return res.json({ success: true });
  } catch (err) {
    console.error('resolve error', err);
    return res.status(500).json({ error: 'Failed to resolve' });
  }
});

// Delete inquiry
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Inquiry.findByIdAndDelete(id);
    return res.json({ success: true });
  } catch (err) {
    console.error('delete error', err);
    return res.status(500).json({ error: 'Failed to delete' });
  }
});

module.exports = router;
