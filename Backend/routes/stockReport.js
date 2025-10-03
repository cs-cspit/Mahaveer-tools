const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get stock report: all products with stock info
router.get('/', async (req, res) => {
  try {
    // Optionally filter by category/subcategory
    const { category, subcategory } = req.query;
    let filter = {};
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    // Only select fields relevant for stock report
    const products = await Product.find(filter).select('name category subcategory brands price stock');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
