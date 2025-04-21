/**
 * Main server file for the Expense Tracker application
 * Sets up Express server with middleware, routes, and database connection
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const logger = require('./config/logger');

// Load environment variables
dotenv.config();

// Import routes
const expenseRoutes = require('./routes/expenseRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Log all requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/expenses', expenseRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  logger.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aryanmahida2:%40Ryan0808@cluster0.mazq6yr.mongodb.net/expense-tracker?retryWrites=true&w=majority&appName=Cluster0';

// Log the connection string (without credentials) for debugging
const sanitizedUri = MONGODB_URI.replace(/mongodb\+srv:\/\/([^:]+):([^@]+)@/, 'mongodb+srv://***:***@');
logger.info(`Attempting to connect to MongoDB: ${sanitizedUri}`);

// MongoDB connection options with serverApi configuration
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  serverApi: { version: '1', strict: true, deprecationErrors: true }
};

mongoose.connect(MONGODB_URI, mongooseOptions)
.then(() => {
  logger.info('MongoDB connected successfully');
  // Start server after DB connection
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
})
.catch((err) => {
  logger.error(`MongoDB connection error: ${err.message}`);
  logger.error('Please check your MONGODB_URI environment variable');
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  logger.error(err.stack);
  process.exit(1);
});

module.exports = app; // Export for testing
