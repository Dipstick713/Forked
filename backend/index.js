const express = require('express');
const cors = require('cors');
const session = require('express-session');
const connectDB = require('./config/database');
require('dotenv').config({ path: './backend/.env' });

const app = express();
const PORT = process.env.PORT || 3000;

// Import routes and passport
const authRoutes = require('./routes/auth');
const passport = require('./passport');

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Forked API is running', status: 'OK' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});