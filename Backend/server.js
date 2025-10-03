// require('dotenv').config();

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// const app = express();

// // Add stock route
// const addStockRoutes = require('./routes/addStock');
// app.use('/api/products', addStockRoutes);

// // CORS configuration
// app.use(cors({
//   origin: [
//     'http://localhost:3000',
//     'http://localhost:5173',
//     'http://127.0.0.1:3000',
//     'http://127.0.0.1:5173',
//     'https://mahaveer-tools.vercel.app',
//     'https://mahaveer-tools-git-main-sgp-3s-projects.vercel.app',
//     'https://mahaveer-tools-p8timngon-sgp-3s-projects.vercel.app'
//   ],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// app.use(express.json({ limit: '10mb' })); // 10MB JSON body limit

// // Serve static files from /public (e.g., images)
// app.use('/images', express.static(require('path').join(__dirname, 'public', 'images')));

// // Connect to MongoDB and start server
// const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mahaveer-tools';

// async function startServer() {
//   try {
//     await mongoose.connect(mongoURI);
//     console.log('MongoDB connected to:', mongoURI);

//     // Health endpoint
//     app.get('/health', (req, res) => res.json({ status: 'ok' }));

//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
//   } catch (err) {
//     console.error('Failed to start server:', err);
//     process.exit(1);
//   }
// }

// // Global error handlers to avoid silent exits
// process.on('unhandledRejection', (reason, promise) => {
//   console.error('Unhandled Rejection at:', promise, 'reason:', reason);
// });

// process.on('uncaughtException', (err) => {
//   console.error('Uncaught Exception thrown:', err);
//   // Optionally exit or keep running depending on severity
// });


// // Authentication routes
// const { router: authRoutes } = require('./routes/auth');
// app.use('/api/auth', authRoutes);

// // Category GET routes
// const categoryRoutes = require('./routes/categoryRoutes');
// app.use('/api/categories', categoryRoutes);

// // Cart routes
// const cartRoutes = require('./routes/cartRoutes');
// app.use('/api/cart', cartRoutes);

// // Product CRUD and filtering routes
// const productRoutes = require('./routes/productRoutes');
// app.use('/api/products', productRoutes);

// // Stock report route
// const stockReportRoutes = require('./routes/stockReport');
// app.use('/api/stock-report', stockReportRoutes);

// // Legacy admin compatibility routes (addproduct, updateproduct, deleteproduct)
// const legacyAdminRoutes = require('./routes/legacyAdminRoutes');
// app.use('/api', legacyAdminRoutes);

// // Payment routes (Razorpay integration samples)
// const paymentRoutes = require('./routes/paymentRoutes');
// app.use('/api/payment', paymentRoutes);

// // Inquiry routes
// const inquiryRoutes = require('./routes/inquiryRoutes');
// app.use('/api/inquiries', inquiryRoutes);

// // Test route
// // If running in production, serve the built frontend from ../Frontend/dist
// // This lets you deploy a single service for both API and frontend (optional).
// const path = require('path');

// if (process.env.NODE_ENV === 'production') {
//   const frontendDist = path.join(__dirname, '..', 'Frontend', 'dist');
//   console.log('Production mode: serving frontend from', frontendDist);
//   app.use(express.static(frontendDist));

//   // For SPA client-side routing, always return index.html for unknown routes
//   // Use '/*' instead of '*' to avoid path-to-regexp error in Express v5+
//   app.get('*', (req, res) => {
//     res.sendFile(path.join(frontendDist, 'index.html'));
//   });
// }

// // Start server (connects to DB first)
// startServer();

// app.get('/', async (req, res) => {
//   res.send('API is running');
// });

// // (server is started inside startServer once DB connects)

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// ----------------------
// Middleware
// ----------------------
app.use(express.json({ limit: '10mb' })); // Handle large JSON payloads

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'https://mahaveer-tools.vercel.app',
    'https://mahaveer-tools-git-main-sgp-3s-projects.vercel.app',
    'https://mahaveer-tools-p8timngon-sgp-3s-projects.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve static files from /public/images
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// ----------------------
// Health Check (always available)
// ----------------------
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ----------------------
// Routes
// ----------------------

// Add stock
console.log("Mounting /api/products -> addStockRoutes");
const addStockRoutes = require('./routes/addStock');
app.use('/api/products', addStockRoutes);

// Auth
console.log("Mounting /api/auth -> authRoutes");
const { router: authRoutes } = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Categories
console.log("Mounting /api/categories -> categoryRoutes");
const categoryRoutes = require('./routes/categoryRoutes');
app.use('/api/categories', categoryRoutes);

// Cart
console.log("Mounting /api/cart -> cartRoutes");
const cartRoutes = require('./routes/cartRoutes');
app.use('/api/cart', cartRoutes);

// Product CRUD
console.log("Mounting /api/products -> productRoutes");
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

// Stock report
console.log("Mounting /api/stock-report -> stockReportRoutes");
const stockReportRoutes = require('./routes/stockReport');
app.use('/api/stock-report', stockReportRoutes);

// Legacy admin compatibility routes
console.log("Mounting /api -> legacyAdminRoutes");
const legacyAdminRoutes = require('./routes/legacyAdminRoutes');
app.use('/api', legacyAdminRoutes);

// Payment
console.log("Mounting /api/payment -> paymentRoutes");
const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/payment', paymentRoutes);

// Inquiries
console.log("Mounting /api/inquiries -> inquiryRoutes");
const inquiryRoutes = require('./routes/inquiryRoutes');
app.use('/api/inquiries', inquiryRoutes);

// ----------------------
// Production: Serve frontend
// ----------------------
if (process.env.NODE_ENV === 'production') {
  const frontendDist = path.join(__dirname, '..', 'Frontend', 'dist');
  console.log('Production mode: serving frontend from', frontendDist);

  app.use(express.static(frontendDist));

  // SPA fallback: send index.html for all unknown routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// ----------------------
// Root test route
// ----------------------
app.get('/', (req, res) => {
  res.send('API is running');
});

// ----------------------
// Start Server (DB first)
// ----------------------
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mahaveer-tools';

async function startServer() {
  try {
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected:', mongoURI);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

// Error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
});

// Start
startServer();
