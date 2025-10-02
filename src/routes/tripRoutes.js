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

// GET /api/v1/trips/route/:routeId/date/:date - Get trips by route and date
router.get('/route/:routeId/date/:date', TripController.getTripsByRouteAndDate);

// GET /api/v1/trips/:id - Get trip by ID
router.get('/:id', TripController.getTripById);

// POST /api/v1/trips - Create new trip
router.post('/', validateRequest(tripValidationSchema), TripController.createTrip);

/**
 * @swagger
 * /api/v1/trips/{id}:
 *   put:
 *     summary: Update trip
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Trip ID (e.g., TRP1735656000000DEF56)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Trip'
 *           example:
 *             schedule:
 *               plannedStartTime: "2025-10-03T09:00:00.000Z"
 *               plannedEndTime: "2025-10-03T12:00:00.000Z"
 *             passengers:
 *               total: 20
 *     responses:
 *       200:
 *         description: Trip updated successfully
 *       404:
 *         description: Trip not found
 */
// PUT /api/v1/trips/:id - Update trip
router.put('/:id', TripController.updateTrip);

// POST /api/v1/trips/:id/progress - Update trip progress
router.post('/:id/progress', TripController.updateTripProgress);

// POST /api/v1/trips/:id/incident - Add incident to trip
router.post('/:id/incident', TripController.addTripIncident);

// POST /api/v1/trips/:id/complete - Complete trip
router.post('/:id/complete', TripController.completeTrip);

/**
 * @swagger
 * /api/v1/trips/{id}:
 *   delete:
 *     summary: Delete trip
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Trip ID (e.g., TRP1735656000000DEF56)
 *     responses:
 *       200:
 *         description: Trip deleted successfully
 *       404:
 *         description: Trip not found
 */
// DELETE /api/v1/trips/:id - Delete trip
router.delete('/:id', TripController.deleteTrip);

module.exports = router;