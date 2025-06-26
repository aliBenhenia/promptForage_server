const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const bodyParser = require('body-parser');

dotenv.config();

// Routes
const authRoutes = require('./routes/auth');
const toolsRoutes = require('./routes/tools');
const userRoutes = require('./routes/user');
const statsRoutes = require('./routes/stats');

// Middleware
const authMiddleware = require('./middleware/auth');

// Load environment variables


// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;


// MongoDB connection
const mongo_uri = process.env.MONGO_URI ;
mongoose.connect(mongo_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again after 24 hours',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all routes
app.use(apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tools', authMiddleware, toolsRoutes);
app.use('/api/user', authMiddleware, userRoutes);
app.use('/api/stats', authMiddleware, statsRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;