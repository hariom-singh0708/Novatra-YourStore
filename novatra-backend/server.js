// server.js (minimal, safe)
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/error');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Load env
dotenv.config();

// Connect to Mongo
connectDB();

const app = express();

/**
 * CORS
 * - Use FRONTEND_URL from .env if present, otherwise allow localhost:5173 for dev
 */
const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
  origin: FRONTEND,
  credentials: true
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dev logging (optional)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

/**
 * Rate limiting (general)
 * Keep tight/specific limiters in route files (eg. OTP limiter inside userRoutes)
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});
app.use(generalLimiter);

// --- Routes (keep route-level middleware inside route files) ---
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health check
app.get('/', (req, res) => res.send('Novatra Backend Running ✅'));

// Error handler (last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
