import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useExpenseContext } from '../context/ExpenseContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import ExpenseList from '../components/ExpenseList';
import ExpenseFilter from '../components/ExpenseFilter';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

/**
 * Dashboard component displaying expense list and statistics
 * @returns {JSX.Element} The rendered Dashboard component
 */
const Dashboard = () => {
  const { expenses, stats, loading, getExpenses, deleteExpense, getExpenseStats } = useExpenseContext();
  const [filters, setFilters] = useState({
    category: '',
    startDate: '',
    endDate: '',
    sort: 'date:desc'
  });

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Apply filters
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    getExpenses(newFilters);
  };

  // Reset filters
  const handleResetFilters = (defaultFilters) => {
    setFilters(defaultFilters);
    getExpenses({});
  };

  // Handle expense deletion
  const handleDelete = async (id) => {
    await deleteExpense(id);
    getExpenseStats();
  };

  // Prepare data for pie chart
  const pieChartData = {
    labels: stats.byCategory?.map(cat => cat._id) || [],
    datasets: [
      {
        data: stats.byCategory?.map(cat => cat.total) || [],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#8AC926',
          '#1982C4',
          '#6A4C93',
          '#F15BB5'
        ],
        borderWidth: 1
      }
    ]
  };

  // Prepare data for bar chart
  const barChartData = {
    labels: stats.byMonth?.map(month => {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return monthNames[month._id - 1];
    }) || [],
    datasets: [
      {
        label: 'Monthly Expenses',
        data: stats.byMonth?.map(month => month.total) || [],
        backgroundColor: '#36A2EB'
      }
    ]
  };

  // Bar chart options
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Expenses'
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Expense Dashboard</h1>
        <Link to="/add" className="btn btn-primary">Add New Expense</Link>
      </div>

      {/* Filter Component */}
      <ExpenseFilter 
        initialFilters={filters}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold">Total Expenses</h2>
          </div>
          <div className="card-body">
            <p className="text-3xl font-bold text-blue-600">{formatCurrency(stats.total || 0)}</p>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold">Expense Count</h2>
          </div>
          <div className="card-body">
            <p className="text-3xl font-bold text-green-600">{expenses.length}</p>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold">Average Expense</h2>
          </div>
          <div className="card-body">
            <p className="text-3xl font-bold text-purple-600">
              {formatCurrency(expenses.length ? stats.total / expenses.length : 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      {!loading && stats.byCategory && stats.byCategory.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold">Expenses by Category</h2>
            </div>
            <div className="card-body p-4 flex justify-center">
              <div className="w-64 h-64">
                <Pie data={pieChartData} />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold">Monthly Expenses</h2>
            </div>
            <div className="card-body p-4">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </div>
        </div>
      )}

      {/* Expense List Component */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold">Recent Expenses</h2>
        </div>
        <ExpenseList 
          expenses={expenses} 
          onDelete={handleDelete} 
          loading={loading} 
        />
      </div>
    </div>
  );
};

export default Dashboard;
