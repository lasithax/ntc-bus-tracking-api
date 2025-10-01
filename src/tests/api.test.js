const request = require('supertest');
const app = require('../server');

describe('NTC Bus Tracking API', () => {
  describe('Health Check', () => {
    test('GET /health should return 200', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('OK');
    });
  });

  describe('Root Endpoint', () => {
    test('GET / should return API information', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('NTC Bus Tracking System API');
      expect(response.body.version).toBe('1.0.0');
    });
  });

  describe('Routes API', () => {
    test('GET /api/v1/routes should return routes list', async () => {
      const response = await request(app).get('/api/v1/routes');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('GET /api/v1/routes/stats should return route statistics', async () => {
      const response = await request(app).get('/api/v1/routes/stats');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('total');
    });
  });

  describe('Buses API', () => {
    test('GET /api/v1/buses should return buses list', async () => {
      const response = await request(app).get('/api/v1/buses');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('GET /api/v1/buses/stats should return bus statistics', async () => {
      const response = await request(app).get('/api/v1/buses/stats');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('total');
    });
  });

  describe('Trips API', () => {
    test('GET /api/v1/trips should return trips list', async () => {
      const response = await request(app).get('/api/v1/trips');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('GET /api/v1/trips/stats should return trip statistics', async () => {
      const response = await request(app).get('/api/v1/trips/stats');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('total');
    });
  });

  describe('Error Handling', () => {
    test('GET /api/v1/nonexistent should return 404', async () => {
      const response = await request(app).get('/api/v1/nonexistent');
      expect(response.status).toBe(404);
    });
  });
});
