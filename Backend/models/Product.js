const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // reference to Category model for consistent joins
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  // subcategory/type inside the category (e.g., Drill Machines)
  subcategory: { type: String, required: true },
  description: { type: String },
  // Keep a flexible specifications/features field
  specifications: {
    type: [
      {
        name: { type: String },
        value: { type: String }
      }
    ],
    default: []
  },
  // Allow brands/variants to be stored per product for admin UI
  brands: [
    {
      name: String,
      description: { type: String, default: 'High-grade product for industrial use.' },
      variants: [
        {
          size: String,
          price: Number
        }
      ]
    }
  ],
  price: { type: Number },
  image: { type: String },
  images: { type: [String], default: [] },
  stock: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);