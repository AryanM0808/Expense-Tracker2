import { Link } from 'react-router-dom';
import { FaPlus, FaChartPie } from 'react-icons/fa';

/**
 * Header component for the application
 * Displays navigation and app title
 * @returns {JSX.Element} The rendered Header component
 */
const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center">
            <FaChartPie className="mr-2" />
            <span>Expense Tracker</span>
          </Link>
          
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/add" 
                  className="btn btn-primary flex items-center"
                >
                  <FaPlus className="mr-1" size={14} />
                  <span>Add Expense</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
