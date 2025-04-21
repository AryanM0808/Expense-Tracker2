import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { useExpenseContext } from '../context/ExpenseContext';

/**
 * ExpenseDetails component for viewing detailed information about a specific expense
 * @returns {JSX.Element} The rendered ExpenseDetails component
 */
const ExpenseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getExpenseById, deleteExpense } = useExpenseContext();
  
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  // Fetch expense data on component mount
  useEffect(() => {
    const fetchExpense = async () => {
      try {
        setLoading(true);
        const expenseData = await getExpenseById(id);
        setExpense(expenseData);
      } catch (error) {
        console.error('Error fetching expense:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    
    fetchExpense();
  }, [id, getExpenseById, navigate]);
  
  /**
   * Handle expense deletion
   */
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id);
        navigate('/');
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!expense) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">Expense Not Found</h2>
        <p className="mb-4">The expense you're looking for doesn't exist or has been deleted.</p>
        <Link to="/" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-4">
        <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center">
          <FaArrowLeft className="mr-1" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
      
      <div className="card">
        <div className="card-header flex justify-between items-center">
          <h1 className="text-xl font-semibold">Expense Details</h1>
          <div className="flex space-x-2">
            <Link 
              to={`/edit/${expense._id}`}
              className="btn btn-secondary flex items-center"
            >
              <FaEdit className="mr-1" />
              <span>Edit</span>
            </Link>
            <button
              onClick={handleDelete}
              className="btn btn-danger flex items-center"
            >
              <FaTrash className="mr-1" />
              <span>Delete</span>
            </button>
          </div>
        </div>
        
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">{expense.title}</h2>
              
              <div className="mb-4">
                <p className="text-gray-600 text-sm">Amount</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(expense.amount)}</p>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-600 text-sm">Category</p>
                <span className={`badge ${
                  expense.category === 'Food' ? 'badge-green' :
                  expense.category === 'Transportation' ? 'badge-blue' :
                  expense.category === 'Entertainment' ? 'badge-purple' :
                  expense.category === 'Shopping' ? 'badge-red' :
                  expense.category === 'Utilities' ? 'badge-yellow' :
                  'badge-gray'
                } text-sm px-3 py-1`}>
                  {expense.category}
                </span>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-600 text-sm">Date</p>
                <p className="font-medium">{formatDate(expense.date)}</p>
              </div>
            </div>
            
            <div>
              <div className="mb-4">
                <p className="text-gray-600 text-sm">Description</p>
                <div className="bg-gray-50 p-3 rounded-md min-h-[100px]">
                  {expense.description ? (
                    <p>{expense.description}</p>
                  ) : (
                    <p className="text-gray-400 italic">No description provided</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Created At</p>
                  <p className="font-medium">{formatDate(expense.createdAt)}</p>
                </div>
                
                <div>
                  <p className="text-gray-600 text-sm">Last Updated</p>
                  <p className="font-medium">{formatDate(expense.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseDetails;
