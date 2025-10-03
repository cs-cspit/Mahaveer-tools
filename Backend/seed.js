require('dotenv').config();
const mongoose = require('mongoose');
const { Category } = require('./models/Category');
const Product = require('./models/Product');

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mahaveer-tools';

async function seed() {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to', mongoURI);

    // Clear existing sample categories/products with a specific marker
    await Product.deleteMany({ _sample: true }).catch(() => {});
    await Category.deleteMany({ _sample: true }).catch(() => {});

    // Create categories
    const cats = [
      { name: 'Power Tools', description: 'Electric and battery-powered power tools', image: '' , _sample: true},
      { name: 'Machine Armature', description: 'Armature and motor components', image: '', _sample: true },
      { name: 'Machining Coil', description: 'Coils and winding components for machining', image: '', _sample: true }
    ];

    const createdCats = [];
    for (const c of cats) {
      const cat = new Category(c);
      await cat.save();
      createdCats.push(cat);
    }

    // Create example products (one per category)
    const products = [
      {
        name: 'Cordless Drill 18V',
        description: 'Compact and powerful 18V cordless drill for professional use.',
        category: createdCats[0]._id,
        subcategory: 'Drill Machines',
        price: 7499,
        // Uses local frontend assets — ensure the frontend dev server (Vite) is running at :5173
        image: 'http://localhost:5173/src/assets/product1.png',
        images: [
          'http://localhost:5173/src/assets/product1.png',
          'http://localhost:5173/src/assets/Product2.png'
        ],
        specifications: [
          { name: 'Power Source', value: 'Battery (18V NiCd/Li-ion)' },
          { name: 'No-load Speed', value: '0-1500 RPM' },
          { name: 'Chuck Size', value: '13 mm (1/2 inch)' },
          { name: 'Torque', value: '35 Nm' },
          { name: 'Weight', value: '1.4 kg (with battery)' }
        ],
        brands: [
          { name: 'MahaveerPro', description: 'Reliable brand', variants: [{ size: 'Standard', price: 7499 }] }
        ],
        _sample: true
      },
      {
        name: 'Armature Rotor A120',
        description: 'High-quality armature rotor for industrial motors.',
        category: createdCats[1]._id,
        subcategory: 'Rotors',
        price: 12500,
        image: 'http://localhost:5173/src/assets/product3.jpg',
        images: [
          'http://localhost:5173/src/assets/product3.jpg'
        ],
        specifications: [
          { name: 'Diameter', value: '120 mm' },
          { name: 'Shaft Diameter', value: '18 mm' },
          { name: 'Material', value: 'High-grade laminated steel' },
          { name: 'Suitable For', value: 'Industrial motors, 3-phase' },
          { name: 'Balancing', value: 'Dynamically balanced' }
        ],
        brands: [
          { name: 'RotorMax', description: 'Precision rotors', variants: [{ size: '120mm', price: 12500 }] }
        ],
        _sample: true
      },
      {
        name: 'Precision Machining Coil 200',
        description: 'Durable machining coil suitable for CNC winding.',
        category: createdCats[2]._id,
        subcategory: 'Coils',
        price: 4200,
        image: 'http://localhost:5173/src/assets/product5.png',
        images: [
          'http://localhost:5173/src/assets/product5.png',
          'http://localhost:5173/src/assets/product6.png'
        ],
        specifications: [
          { name: 'Wire Gauge', value: 'AWG 24' },
          { name: 'Length', value: '200 mm' },
          { name: 'Insulation', value: 'Polyester' },
          { name: 'Operating Temperature', value: '-40°C to 120°C' },
          { name: 'Application', value: 'CNC winding, precision machines' }
        ],
        brands: [
          { name: 'CoilWorks', description: 'High efficiency coils', variants: [{ size: '200g', price: 4200 }] }
        ],
        _sample: true
      }
    ];

    const createdProducts = [];
    for (const p of products) {
      const prod = new Product(p);
      await prod.save();
      createdProducts.push(prod);
    }

    console.log('Inserted categories:');
    console.log(createdCats.map(c => ({ _id: c._id, name: c.name })));

    console.log('Inserted products:');
    console.log(createdProducts.map(p => ({ _id: p._id, name: p.name, category: p.category, price: p.price })));

    await mongoose.disconnect();
    console.log('Done.');
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
