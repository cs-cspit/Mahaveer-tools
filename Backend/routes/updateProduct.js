// Update Product Route
const express = require('express');
const multer = require('multer');
const router = express.Router();
const { Category } = require('../models/Category');

const upload = multer({
  limits: {
    fileSize: 20 * 1024 * 1024,
    fieldSize: 50 * 1024 * 1024
  }
});

router.put('/:id', upload.any(), async (req, res) => {
  try {
    let products = [];
    if (req.body.products) {
      if (typeof req.body.products === 'string') {
        products = JSON.parse(req.body.products);
      } else {
        products = req.body.products;
      }
    }
    if (req.files && req.files.length > 0) {
      const file = req.files[0];
      const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      for (let i = products.length - 1; i >= 0; i--) {
        if (!products[i].image) {
          products[i].image = base64;
          break;
        }
      }
    }
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { products },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update subcategories', details: err.message, stack: err.stack });
  }
});

module.exports = router;
