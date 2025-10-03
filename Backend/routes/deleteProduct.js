// Delete Product Route
const express = require('express');
const router = express.Router();
const { Category } = require('../models/Category');

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete category', details: err.message });
  }
});

module.exports = router;
