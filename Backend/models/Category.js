// const mongoose = require('mongoose');

// const categorySchema = new mongoose.Schema({
//   name: String,
//   products: [
//     {
//       name: String,
//       image: String,
//       brands: [
//         {
//           name: String,
//           description: {
//             type: String,
//             default: 'High-grade product for industrial use.'
//           },
//           variants: [
//             {
//               size: String,
//               price: Number
//             }
//           ]
//         }
//       ]
//     }
//   ]
// });

// // Prevent OverwriteModelError
// module.exports = mongoose.models.Category || mongoose.model('Category', categorySchema, 'categories');
// Category Schema
const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., Power Tools
  description: { type: String },
  image: { type: String }, // category thumbnail
});

const Category = mongoose.model("Category", CategorySchema);

// Subcategory Schema (Filter options inside a category)
const SubcategorySchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  name: { type: String, required: true }, // e.g., Drill Machines, Cutting Machine
});

const Subcategory = mongoose.model("Subcategory", SubcategorySchema);

module.exports = { Category, Subcategory };
