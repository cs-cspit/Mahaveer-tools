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
// // Use FRONTEND_URL if set, otherwise default to localhost
// const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
// // Set CORS headers to allow requests only from the frontend URL
// app.use(cors({
//   origin: FRONTEND_URL,
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

/**
 * Core middleware
 * - JSON body parsing
 * - CORS: single, unified config
 * - Static files
 */
app.use(express.json({ limit: '10mb' })); // request bodies up to 10MB [web:84]

/**
 * CORS configuration:
 * - Browsers will see the API base URL so restrict by origin rather than hiding the URL
 * - Use a single cors() call to avoid conflicting headers
 * - In production, prefer setting FRONTEND_URL to the vercel app origin
 */
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'https://mahaveer-tools.vercel.app',
  'https://mahaveer-tools-git-main-sgp-3s-projects.vercel.app',
  'https://mahaveer-tools-p8timngon-sgp-3s-projects.vercel.app'
];

const FRONTEND_URL = process.env.FRONTEND_URL;
const corsOrigin = FRONTEND_URL || ALLOWED_ORIGINS;

app.use(
  cors({
    origin: corsOrigin, // one source of truth [web:77][web:73]
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

/**
 * Static assets (optional public folder)
 */
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

/**
 * Routes
 */
const addStockRoutes = require('./routes/addStock');
app.use('/api/products', addStockRoutes); // ensure no route conflicts later [web:84]

const { router: authRoutes } = require('./routes/auth');
app.use('/api/auth', authRoutes);

const categoryRoutes = require('./routes/categoryRoutes');
app.use('/api/categories', categoryRoutes);

const cartRoutes = require('./routes/cartRoutes');
app.use('/api/cart', cartRoutes);

const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes); // shares base with addStock; both must define non-overlapping subpaths [web:84]

const stockReportRoutes = require('./routes/stockReport');
app.use('/api/stock-report', stockReportRoutes);

const legacyAdminRoutes = require('./routes/legacyAdminRoutes');
app.use('/api', legacyAdminRoutes);

const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/payment', paymentRoutes);

const inquiryRoutes = require('./routes/inquiryRoutes');
app.use('/api/inquiries', inquiryRoutes);

/**
 * Health and root endpoints
 */
app.get('/health', (req, res) => res.json({ status: 'ok' })); // for Render health checks [web:104][web:108]
app.get('/', (req, res) => res.send('API is running')); // simple root test [web:91]

/**
 * Production SPA fallback (Express v5 safe)
 * - Use a named wildcard or new-style pattern to avoid path-to-regexp errors
 * - Serve only if bundling the frontend into the same service
 */
if (process.env.NODE_ENV === 'production') {
  const frontendDist = path.join(__dirname, '..', 'Frontend', 'dist');
  console.log('Production mode: serving frontend from', frontendDist);

  // Serve static assets
  app.use(express.static(frontendDist));

  // Express v5: avoid bare "*" which throws “Missing parameter name”
  // Two safe options:
  // 1) app.get('/*splat', ...) and read req.params.splat
  // 2) app.get('/{*splat}', ...) with path-to-regexp v8
  app.get('/*splat', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

/**
 * Start server after DB is connected
 */
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mahaveer-tools';

async function startServer() {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected to:', mongoURI);

    const PORT = process.env.PORT || 5000;
    // Bind to 0.0.0.0 for Render, not localhost
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Global error logs (do not exit immediately so logs are visible)
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
});

startServer();
