import { useState } from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';

/**
 * ExpenseFilter component for filtering expenses by various criteria
 * @param {Object} props - Component props
 * @param {Object} props.initialFilters - Initial filter values
 * @param {Function} props.onApplyFilters - Function to call when filters are applied
 * @param {Function} props.onResetFilters - Function to call when filters are reset
 * @returns {JSX.Element} The rendered ExpenseFilter component
 */
const ExpenseFilter = ({ 
  initialFilters = {
    category: '',
    startDate: '',
    endDate: '',
    sort: 'date:desc'
  },
  onApplyFilters,
  onResetFilters
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  
  /**
   * Handle filter change
   * @param {Object} e - Event object
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  /**
   * Apply filters
   */
  const applyFilters = () => {
    onApplyFilters(filters);
    setIsOpen(false);
  };
  
  /**
   * Reset filters
   */
  const resetFilters = () => {
    const resetValues = {
      category: '',
      startDate: '',
      endDate: '',
      sort: 'date:desc'
    };
    setFilters(resetValues);
    onResetFilters(resetValues);
    setIsOpen(false);
  };
  
  /**
   * Toggle filter panel
   */
  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <div className="mb-6">
      <button 
        onClick={toggleFilter}
        className="btn btn-secondary flex items-center"
      >
        {isOpen ? <FaTimes className="mr-2" /> : <FaFilter className="mr-2" />}
        <span>{isOpen ? 'Close Filters' : 'Filter Expenses'}</span>
      </button>
      
      {isOpen && (
        <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">Filter Expenses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="form-group">
              <label htmlFor="category" className="form-label">Category</label>
              <select 
                id="category"
                name="category"
                value={filters.category}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">All Categories</option>
                <option value="Food">Food</option>
                <option value="Transportation">Transportation</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Shopping">Shopping</option>
                <option value="Utilities">Utilities</option>
                <option value="Housing">Housing</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Personal">Personal</option>
                <option value="Education">Education</option>
                <option value="Gifts">Gifts</option>
                <option value="Travel">Travel</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="startDate" className="form-label">Start Date</label>
              <input 
                type="date"
                id="startDate"
                name="startDate"
                value={filters.startDate}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="endDate" className="form-label">End Date</label>
              <input 
                type="date"
                id="endDate"
                name="endDate"
                value={filters.endDate}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="sort" className="form-label">Sort By</label>
              <select 
                id="sort"
                name="sort"
                value={filters.sort}
                onChange={handleChange}
                className="form-input"
              >
                <option value="date:desc">Date (Newest)</option>
                <option value="date:asc">Date (Oldest)</option>
                <option value="amount:desc">Amount (Highest)</option>
                <option value="amount:asc">Amount (Lowest)</option>
                <option value="title:asc">Title (A-Z)</option>
                <option value="title:desc">Title (Z-A)</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-4">
            <button 
              onClick={resetFilters}
              className="btn btn-secondary"
            >
              Reset
            </button>
            <button 
              onClick={applyFilters}
              className="btn btn-primary"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

ExpenseFilter.propTypes = {
  initialFilters: PropTypes.shape({
    category: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    sort: PropTypes.string
  }),
  onApplyFilters: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func.isRequired
};

export default ExpenseFilter;
