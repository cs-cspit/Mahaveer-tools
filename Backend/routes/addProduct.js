// Add Product Route
const express = require('express');
const router = express.Router();
const { Category } = require('../models/Category');

router.post('/', async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
