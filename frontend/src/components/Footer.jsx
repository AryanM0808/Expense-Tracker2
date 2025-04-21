/**
 * Footer component for the application
 * Displays copyright information and year
 * @returns {JSX.Element} The rendered Footer component
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {currentYear} Expense Tracker. All rights reserved.</p>
        <p className="text-sm text-gray-400 mt-1">
          Built with React, Express, Node.js, and MongoDB
        </p>
      </div>
    </footer>
  );
};

export default Footer;
