# Expense Tracker Application

A full-stack expense tracking application built with React, Node.js, Express, and MongoDB.

## Features

- Track and manage your expenses with CRUD operations
- Filter expenses by category, date range, and other criteria
- Visualize expense data with charts and statistics
- Responsive design that works on desktop and mobile devices

## Tech Stack

### Frontend
- React with JavaScript
- Vite for fast development and building
- React Router for navigation
- Chart.js for data visualization
- Tailwind CSS for styling
- Axios for API requests

### Backend
- Node.js and Express for the server
- MongoDB with Mongoose for database operations
- MVC architecture for clean code organization
- Winston for logging
- Jest for testing

## Project Structure

```
expense-tracker/
├── frontend/               # React frontend application
│   ├── public/             # Static files
│   ├── src/                # Source code
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context for state management
│   │   ├── pages/          # Page components
│   │   └── tests/          # Frontend tests
│   ├── index.html          # HTML entry point
│   └── vite.config.js      # Vite configuration
│
├── backend/                # Node.js backend application
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers (MVC)
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── tests/              # Backend tests
│   └── server.js           # Server entry point
│
└── README.md               # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd expense-tracker
   ```

2. Install backend dependencies
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies
   ```
   cd ../frontend
   npm install
   ```

4. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/expense-tracker
   NODE_ENV=development
   ```

### Running the Application

1. Start the backend server
   ```
   cd backend
   npm run dev
   ```

2. Start the frontend development server
   ```
   cd ../frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

- `GET /api/expenses` - Get all expenses (with optional filtering)
- `GET /api/expenses/:id` - Get a single expense by ID
- `POST /api/expenses` - Create a new expense
- `PUT /api/expenses/:id` - Update an existing expense
- `DELETE /api/expenses/:id` - Delete an expense
- `GET /api/expenses/stats` - Get expense statistics

## Testing

### Backend Tests
```
cd backend
npm test
```

### Frontend Tests
```
cd frontend
npm test
```

## Deployment

The application can be deployed using Docker. Dockerfile is provided in both frontend and backend directories.

## License

This project is licensed under the MIT License.
