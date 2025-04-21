/**
 * Expense model schema
 * @module models/Expense
 */

const mongoose = require('mongoose');

/**
 * Expense Schema
 * @typedef {Object} ExpenseSchema
 * @property {string} title - The title of the expense
 * @property {number} amount - The amount of the expense
 * @property {string} category - The category of the expense
 * @property {Date} date - The date of the expense
 * @property {string} description - Optional description of the expense
 * @property {Date} createdAt - When the expense record was created
 * @property {Date} updatedAt - When the expense record was last updated
 */
const ExpenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
    min: [0, 'Amount must be a positive number']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Utilities', 'Housing', 'Healthcare', 'Personal', 'Education', 'Gifts', 'Travel', 'Other'],
    default: 'Other'
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  }
}, {
  timestamps: true
});

/**
 * Pre-save middleware to validate expense data
 * @function pre
 * @param {string} 'save' - The operation to hook into
 * @param {Function} next - The next middleware function
 * @returns {void}
 */
ExpenseSchema.pre('save', function(next) {
  // Additional validation or data transformation can be added here
  next();
});

/**
 * Static method to get total expenses by category
 * @function getTotalByCategory
 * @returns {Promise<Array>} Array of categories with total amounts
 */
ExpenseSchema.statics.getTotalByCategory = async function() {
  return this.aggregate([
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' }
      }
    },
    {
      $sort: { total: -1 }
    }
  ]);
};

/**
 * Static method to get monthly expense summary
 * @function getMonthlyExpenses
 * @param {number} year - The year to get data for
 * @returns {Promise<Array>} Monthly expense data
 */
ExpenseSchema.statics.getMonthlyExpenses = async function(year) {
  return this.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$date' },
        total: { $sum: '$amount' }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
};

module.exports = mongoose.model('Expense', ExpenseSchema);
