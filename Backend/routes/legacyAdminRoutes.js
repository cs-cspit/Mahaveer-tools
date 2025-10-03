const express = require('express');
const router = express.Router();
const { Category } = require('../models/Category');

// Legacy endpoint used by older admin UI to add a category (named addproduct historically)
router.post('/addproduct', async (req, res) => {
  try {
    const { name, description, image } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const existing = await Category.findOne({ name: name.trim() });
    if (existing) return res.status(400).json({ error: 'Category already exists' });
    const cat = new Category({ name: name.trim(), description: description || '', image: image || '' });
    await cat.save();
    res.status(201).json(cat);
  } catch (err) {
    console.error('Legacy addproduct error:', err);
    res.status(500).json({ error: 'Failed to add category' });
  }
});

// Legacy update category
router.put('/updateproduct/:id', async (req, res) => {
  try {
    const updates = {};
    if (req.body.name) updates.name = req.body.name.trim();
    if (req.body.description) updates.description = req.body.description;
    if (req.body.image) updates.image = req.body.image;
    const cat = await Category.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!cat) return res.status(404).json({ error: 'Category not found' });
    res.json(cat);
  } catch (err) {
    console.error('Legacy updateproduct error:', err);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Legacy delete category
router.delete('/deleteproduct/:id', async (req, res) => {
  try {
    const cat = await Category.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json({ error: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    console.error('Legacy deleteproduct error:', err);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

module.exports = router;
