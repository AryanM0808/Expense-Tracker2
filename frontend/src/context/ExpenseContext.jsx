import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * Context for managing expense data and operations
 * @typedef {Object} ExpenseContextType
 * @property {Array} expenses - List of all expenses
 * @property {Object} stats - Statistics about expenses
 * @property {boolean} loading - Loading state
 * @property {Function} getExpenses - Function to fetch all expenses
 * @property {Function} getExpenseById - Function to fetch a single expense by ID
 * @property {Function} addExpense - Function to add a new expense
 * @property {Function} updateExpense - Function to update an existing expense
 * @property {Function} deleteExpense - Function to delete an expense
 * @property {Function} getExpenseStats - Function to fetch expense statistics
 */

// Create the context
const ExpenseContext = createContext();

// Base URL for API
const API_URL = '/api/expenses';

/**
 * Provider component for expense context
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Provider component
 */
export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    byCategory: [],
    byMonth: []
  });
  const [loading, setLoading] = useState(true);

  /**
   * Fetch all expenses with optional filters
   * @async
   * @param {Object} filters - Optional filters for expenses
   * @param {string} filters.category - Filter by category
   * @param {string} filters.startDate - Filter by start date
   * @param {string} filters.endDate - Filter by end date
   * @param {string} filters.sort - Sort field and direction (e.g. 'date:desc')
   * @returns {Promise<Array>} List of expenses
   */
  const getExpenses = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      
      // Build query string from filters
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      const response = await axios.get(`${API_URL}?${queryParams.toString()}`);
      
      if (response.data.success) {
        setExpenses(response.data.data);
        return response.data.data;
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch a single expense by ID
   * @async
   * @param {string} id - Expense ID
   * @returns {Promise<Object>} Expense data
   */
  const getExpenseById = async (id) => {
    try {
      // We don't set global loading state here anymore
      // Each component will manage its own loading state
      const response = await axios.get(`${API_URL}/${id}`);
      
      if (response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      console.error('Error fetching expense:', error);
      toast.error('Failed to fetch expense details');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add a new expense
   * @async
   * @param {Object} expenseData - New expense data
   * @returns {Promise<Object>} Created expense
   */
  const addExpense = async (expenseData) => {
    try {
      setLoading(true);
      const response = await axios.post(API_URL, expenseData);
      
      if (response.data.success) {
        setExpenses([response.data.data, ...expenses]);
        toast.success('Expense added successfully');
        return response.data.data;
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      
      if (error.response && error.response.data && error.response.data.error) {
        // Show validation errors if any
        if (Array.isArray(error.response.data.error)) {
          error.response.data.error.forEach(err => toast.error(err));
        } else {
          toast.error(error.response.data.error);
        }
      } else {
        toast.error('Failed to add expense');
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update an existing expense
   * @async
   * @param {string} id - Expense ID
   * @param {Object} expenseData - Updated expense data
   * @returns {Promise<Object>} Updated expense
   */
  const updateExpense = async (id, expenseData) => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/${id}`, expenseData);
      
      if (response.data.success) {
        // Update the expenses state
        setExpenses(expenses.map(expense => 
          expense._id === id ? response.data.data : expense
        ));
        
        toast.success('Expense updated successfully');
        return response.data.data;
      }
    } catch (error) {
      console.error('Error updating expense:', error);
      
      if (error.response && error.response.data && error.response.data.error) {
        // Show validation errors if any
        if (Array.isArray(error.response.data.error)) {
          error.response.data.error.forEach(err => toast.error(err));
        } else {
          toast.error(error.response.data.error);
        }
      } else {
        toast.error('Failed to update expense');
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete an expense
   * @async
   * @param {string} id - Expense ID
   * @returns {Promise<boolean>} Success status
   */
  const deleteExpense = async (id) => {
    try {
      setLoading(true);
      const response = await axios.delete(`${API_URL}/${id}`);
      
      if (response.data.success) {
        // Remove the deleted expense from state
        setExpenses(expenses.filter(expense => expense._id !== id));
        
        toast.success('Expense deleted successfully');
        return true;
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch expense statistics
   * @async
   * @returns {Promise<Object>} Expense statistics
   */
  const getExpenseStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/stats`);
      
      if (response.data.success) {
        setStats(response.data.data);
        return response.data.data;
      }
    } catch (error) {
      console.error('Error fetching expense stats:', error);
      toast.error('Failed to fetch expense statistics');
    } finally {
      setLoading(false);
    }
  };

  // Load expenses on initial render
  useEffect(() => {
    getExpenses();
    getExpenseStats();
  }, [getExpenses]);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        stats,
        loading,
        getExpenses,
        getExpenseById,
        addExpense,
        updateExpense,
        deleteExpense,
        getExpenseStats
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

/**
 * Custom hook to use the expense context
 * @returns {ExpenseContextType} Expense context
 */
export const useExpenseContext = () => {
  const context = useContext(ExpenseContext);
  
  if (!context) {
    throw new Error('useExpenseContext must be used within an ExpenseProvider');
  }
  
  return context;
};
