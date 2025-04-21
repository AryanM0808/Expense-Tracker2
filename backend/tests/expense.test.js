/**
 * Tests for expense API endpoints
 * @module tests/expense.test
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Expense = require('../models/Expense');

// Sample expense data for testing
const sampleExpense = {
  title: 'Test Expense',
  amount: 100,
  category: 'Food',
  description: 'Test description'
};

/**
 * Clear the database before each test
 */
beforeEach(async () => {
  await Expense.deleteMany({});
});

/**
 * Close database connection after all tests
 */
afterAll(async () => {
  await mongoose.connection.close();
});

/**
 * Test suite for expense API endpoints
 */
describe('Expense API', () => {
  /**
   * Test creating a new expense
   */
  describe('POST /api/expenses', () => {
    it('should create a new expense', async () => {
      const res = await request(app)
        .post('/api/expenses')
        .send(sampleExpense);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.title).toBe(sampleExpense.title);
      expect(res.body.data.amount).toBe(sampleExpense.amount);
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/expenses')
        .send({ title: 'Missing Fields' });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBeDefined();
    });
  });

  /**
   * Test getting all expenses
   */
  describe('GET /api/expenses', () => {
    it('should get all expenses', async () => {
      // Create test expenses
      await Expense.create(sampleExpense);
      await Expense.create({
        ...sampleExpense,
        title: 'Second Expense',
        category: 'Transportation'
      });

      const res = await request(app).get('/api/expenses');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(2);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should filter expenses by category', async () => {
      // Create test expenses with different categories
      await Expense.create(sampleExpense);
      await Expense.create({
        ...sampleExpense,
        title: 'Transportation Expense',
        category: 'Transportation'
      });

      const res = await request(app)
        .get('/api/expenses')
        .query({ category: 'Food' });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].category).toBe('Food');
    });
  });

  /**
   * Test getting a single expense
   */
  describe('GET /api/expenses/:id', () => {
    it('should get a single expense by ID', async () => {
      const expense = await Expense.create(sampleExpense);

      const res = await request(app).get(`/api/expenses/${expense._id}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(expense._id.toString());
    });

    it('should return 404 if expense not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/expenses/${nonExistentId}`);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Expense not found');
    });
  });

  /**
   * Test updating an expense
   */
  describe('PUT /api/expenses/:id', () => {
    it('should update an expense', async () => {
      const expense = await Expense.create(sampleExpense);
      const updatedData = {
        title: 'Updated Title',
        amount: 200
      };

      const res = await request(app)
        .put(`/api/expenses/${expense._id}`)
        .send(updatedData);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(updatedData.title);
      expect(res.body.data.amount).toBe(updatedData.amount);
      // Category should remain unchanged
      expect(res.body.data.category).toBe(sampleExpense.category);
    });

    it('should return 404 if expense not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/expenses/${nonExistentId}`)
        .send({ title: 'Updated Title' });
      
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toBe(false);
    });
  });

  /**
   * Test deleting an expense
   */
  describe('DELETE /api/expenses/:id', () => {
    it('should delete an expense', async () => {
      const expense = await Expense.create(sampleExpense);

      const res = await request(app).delete(`/api/expenses/${expense._id}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      
      // Verify expense is deleted from database
      const deletedExpense = await Expense.findById(expense._id);
      expect(deletedExpense).toBeNull();
    });

    it('should return 404 if expense not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/api/expenses/${nonExistentId}`);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toBe(false);
    });
  });

  /**
   * Test getting expense statistics
   */
  describe('GET /api/expenses/stats', () => {
    it('should get expense statistics', async () => {
      // Create test expenses
      await Expense.create(sampleExpense);
      await Expense.create({
        ...sampleExpense,
        title: 'Transportation Expense',
        category: 'Transportation',
        amount: 50
      });

      const res = await request(app).get('/api/expenses/stats');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('total');
      expect(res.body.data).toHaveProperty('byCategory');
      expect(res.body.data).toHaveProperty('byMonth');
      expect(res.body.data.total).toBe(150); // Sum of all expense amounts
    });
  });
});
