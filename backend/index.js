const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { configDotenv, config } = require('dotenv');
require('dotenv').config({ path: './backend/.env' });
const app = express();
const PORT = process.env.PORT || 3000;
const session = require('express-session');
const passport = require('./passport');
const authRoutes = require('./routes/auth');

// Middleware
app.use(cors());
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true } // Set to true if using HTTPS
}));
app.use(passport.initialize());
app.use(passport.session());

//MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Sample route
app.get('/', (req, res) => {
  res.send('Forked API is running');
});

// Routes
//const threadRoutes = require('./routes/threads');
//app.use('/api/threads', threadRoutes);
app.use('/auth', authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
