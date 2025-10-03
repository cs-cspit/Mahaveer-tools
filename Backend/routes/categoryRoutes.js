const express = require('express');
const router = express.Router();
const { Category, Subcategory } = require('../models/Category');

// Get all categories
router.get('/', async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

// Get a single category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

// Get subcategories for a category
router.get('/:id/subcategories', async (req, res) => {
  try {
    console.log('Fetching subcategories for category:', req.params.id);
    const subs = await Subcategory.find({ category: req.params.id });
    console.log('Found subcategories:', subs.length);
    res.json(subs);
  } catch (err) {
    console.error('Error fetching subcategories:', err);
    res.status(500).json({ error: 'Failed to fetch subcategories' });
  }
});

// Create a new subcategory under a category
router.post('/:id/subcategories', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ error: 'Subcategory name is required' });
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    const existing = await Subcategory.findOne({ category: req.params.id, name: name.trim() });
    if (existing) return res.status(409).json({ error: 'Subcategory already exists' });

    const sub = new Subcategory({ category: req.params.id, name: name.trim() });
    await sub.save();
    res.status(201).json(sub);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create subcategory' });
  }
});

// Delete a subcategory by id
router.delete('/subcategories/:subId', async (req, res) => {
  try {
    console.log('Deleting subcategory:', req.params.subId);
    const sub = await Subcategory.findByIdAndDelete(req.params.subId);
    if (!sub) {
      console.log('Subcategory not found');
      return res.status(404).json({ error: 'Subcategory not found' });
    }
    console.log('Deleted subcategory:', sub);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting subcategory:', err);
    res.status(500).json({ error: 'Failed to delete subcategory' });
  }
});

module.exports = router;
