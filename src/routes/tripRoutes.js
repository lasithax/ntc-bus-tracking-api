const express = require('express');
const router = express.Router();
const TripController = require('../controllers/tripController');
const { validateRequest, tripValidationSchema } = require('../middleware/validation');

// GET /api/v1/trips - Get all trips
router.get('/', TripController.getAllTrips);

// GET /api/v1/trips/active - Get active trips
router.get('/active', TripController.getActiveTrips);

// GET /api/v1/trips/stats - Get trip statistics
router.get('/stats', TripController.getTripStats);

// GET /api/v1/trips/:id - Get trip by ID
router.get('/:id', TripController.getTripById);

// POST /api/v1/trips - Create new trip
router.post('/', validateRequest(tripValidationSchema), TripController.createTrip);

module.exports = router;
