/**
 * Controller for expense operations
 * Handles all CRUD operations for expenses
 * @module controllers/expenseController
 */

const Expense = require('../models/Expense');
const logger = require('../config/logger');

/**
 * Get all expenses with optional filtering
 * @async
 * @function getExpenses
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with expenses data
 */
exports.getExpenses = async (req, res, next) => {
  try {
    const { category, startDate, endDate, sort } = req.query;
    
    // Build query
    const query = {};
    
    // Filter by category if provided
    if (category) {
      query.category = category;
    }
    
    // Filter by date range if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    // Build sort options
    let sortOptions = { date: -1 }; // Default sort by date descending
    if (sort) {
      const [field, order] = sort.split(':');
      sortOptions = { [field]: order === 'asc' ? 1 : -1 };
    }
    
    const expenses = await Expense.find(query).sort(sortOptions);
    
    // Calculate total amount
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    logger.info(`Retrieved ${expenses.length} expenses`);
    
    res.status(200).json({
      success: true,
      count: expenses.length,
      total,
      data: expenses
    });
  } catch (error) {
    logger.error(`Error getting expenses: ${error.message}`);
    next(error);
  }
};

/**
 * Get a single expense by ID
 * @async
 * @function getExpense
 * @param {Object} req - Express request object with expense ID in params
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with expense data
 */
exports.getExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);
    
    if (!expense) {
      logger.warn(`Expense not found with id: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        error: 'Expense not found'
      });
    }
    
    logger.info(`Retrieved expense with id: ${req.params.id}`);
    
    res.status(200).json({
      success: true,
      data: expense
    });
  } catch (error) {
    logger.error(`Error getting expense: ${error.message}`);
    next(error);
  }
};

/**
 * Create a new expense
 * @async
 * @function createExpense
 * @param {Object} req - Express request object with expense data in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with created expense data
 */
exports.createExpense = async (req, res, next) => {
  try {
    const expense = await Expense.create(req.body);
    
    logger.info(`Created new expense with id: ${expense._id}`);
    
    res.status(201).json({
      success: true,
      data: expense
    });
  } catch (error) {
    logger.error(`Error creating expense: ${error.message}`);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    next(error);
  }
};

/**
 * Update an existing expense
 * @async
 * @function updateExpense
 * @param {Object} req - Express request object with expense ID in params and update data in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with updated expense data
 */
exports.updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return updated document
        runValidators: true // Run model validators
      }
    );
    
    if (!expense) {
      logger.warn(`Expense not found with id: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        error: 'Expense not found'
      });
    }
    
    logger.info(`Updated expense with id: ${req.params.id}`);
    
    res.status(200).json({
      success: true,
      data: expense
    });
  } catch (error) {
    logger.error(`Error updating expense: ${error.message}`);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    next(error);
  }
};

/**
 * Delete an expense
 * @async
 * @function deleteExpense
 * @param {Object} req - Express request object with expense ID in params
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with success status
 */
exports.deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    
    if (!expense) {
      logger.warn(`Expense not found with id: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        error: 'Expense not found'
      });
    }
    
    logger.info(`Deleted expense with id: ${req.params.id}`);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    logger.error(`Error deleting expense: ${error.message}`);
    next(error);
  }
};

/**
 * Get expense statistics
 * @async
 * @function getExpenseStats
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with expense statistics
 */
exports.getExpenseStats = async (req, res, next) => {
  try {
    // Get total by category
    const categoryStats = await Expense.getTotalByCategory();
    
    // Get monthly expenses for current year
    const currentYear = new Date().getFullYear();
    const monthlyStats = await Expense.getMonthlyExpenses(currentYear);
    
    // Get total expenses
    const total = await Expense.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    
    logger.info('Retrieved expense statistics');
    
    res.status(200).json({
      success: true,
      data: {
        total: total.length > 0 ? total[0].total : 0,
        byCategory: categoryStats,
        byMonth: monthlyStats
      }
    });
  } catch (error) {
    logger.error(`Error getting expense stats: ${error.message}`);
    next(error);
  }
};
