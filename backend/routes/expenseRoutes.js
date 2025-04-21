/**
 * Routes for expense operations
 * @module routes/expenseRoutes
 */

const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

/**
 * @route   GET /api/expenses
 * @desc    Get all expenses with optional filtering
 * @access  Public
 */
router.get('/', expenseController.getExpenses);

/**
 * @route   GET /api/expenses/stats
 * @desc    Get expense statistics
 * @access  Public
 */
router.get('/stats', expenseController.getExpenseStats);

/**
 * @route   GET /api/expenses/:id
 * @desc    Get a single expense by ID
 * @access  Public
 */
router.get('/:id', expenseController.getExpense);

/**
 * @route   POST /api/expenses
 * @desc    Create a new expense
 * @access  Public
 */
router.post('/', expenseController.createExpense);

/**
 * @route   PUT /api/expenses/:id
 * @desc    Update an expense
 * @access  Public
 */
router.put('/:id', expenseController.updateExpense);

/**
 * @route   DELETE /api/expenses/:id
 * @desc    Delete an expense
 * @access  Public
 */
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;
