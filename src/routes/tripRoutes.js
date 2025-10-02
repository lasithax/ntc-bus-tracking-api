/**
 * @swagger
 * components:
 *   schemas:
 *     Trip:
 *       type: object
 *       required:
 *         - routeId
 *         - busId
 *         - driver
 *         - schedule
 *         - passengers
 *         - status
 *       properties:
 *         tripId:
 *           type: string
 *           description: Auto-generated trip ID
 *           example: "TRP1735656000000DEF56"
 *         routeId:
 *           type: string
 *           description: Associated route ID
 *           example: "RT1735656000000ABC12"
 *         busId:
 *           type: string
 *           description: Associated bus ID
 *           example: "BUS1735656000000XYZ34"
 *         driver:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: "Rajesh Fernando"
 *             licenseNumber:
 *               type: string
 *               example: "DL987654321"
 *             phone:
 *               type: string
 *               example: "+94-77-9876543"
 *             experience:
 *               type: integer
 *               example: 8
 *         route:
 *           type: object
 *           properties:
 *             origin:
 *               type: object
 *               properties:
 *                 city:
 *                   type: string
 *                   example: "Colombo"
 *                 province:
 *                   type: string
 *                   example: "Western"
 *                 coordinates:
 *                   type: object
 *                   properties:
 *                     latitude:
 *                       type: number
 *                       example: 6.9271
 *                     longitude:
 *                       type: number
 *                       example: 79.8612
 *             destination:
 *               type: object
 *               properties:
 *                 city:
 *                   type: string
 *                   example: "Kandy"
 *                 province:
 *                   type: string
 *                   example: "Central"
 *                 coordinates:
 *                   type: object
 *                   properties:
 *                     latitude:
 *                       type: number
 *                       example: 7.2906
 *                     longitude:
 *                       type: number
 *                       example: 80.6337
 *             waypoints:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Kadawatha"
 *                   coordinates:
 *                     type: object
 *                     properties:
 *                       latitude:
 *                         type: number
 *                       longitude:
 *                         type: number
 *                   order:
 *                     type: integer
 *         schedule:
 *           type: object
 *           properties:
 *             plannedStartTime:
 *               type: string
 *               format: date-time
 *               example: "2025-10-02T08:00:00.000Z"
 *             plannedEndTime:
 *               type: string
 *               format: date-time
 *               example: "2025-10-02T14:00:00.000Z"
 *             departureDelay:
 *               type: integer
 *               example: 0
 *               description: "Delay in minutes"
 *             arrivalDelay:
 *               type: integer
 *               example: 0
 *               description: "Delay in minutes"
 *         passengers:
 *           type: object
 *           properties:
 *             current:
 *               type: integer
 *               example: 30
 *             capacity:
 *               type: integer
 *               example: 50
 *             boarding:
 *               type: integer
 *               example: 5
 *             alighting:
 *               type: integer
 *               example: 2
 *         status:
 *           type: string
 *           enum: [scheduled, boarding, departed, in_transit, arrived, cancelled]
 *           example: "in_transit"
 *         progress:
 *           type: object
 *           properties:
 *             percentage:
 *               type: number
 *               example: 50.5
 *             currentLocation:
 *               type: object
 *               properties:
 *                 latitude:
 *                   type: number
 *                   example: 7.1000
 *                 longitude:
 *                   type: number
 *                   example: 80.2000
 *             nextStop:
 *               type: string
 *               example: "Kadawatha"
 *             estimatedArrival:
 *               type: string
 *               format: date-time
 *               example: "2025-10-02T08:30:00.000Z"
 *         incidents:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [delay, breakdown, accident, traffic]
 *               description:
 *                 type: string
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *               severity:
 *                 type: string
 *                 enum: [low, medium, high, critical]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/v1/trips:
 *   get:
 *     summary: Get all trips
 *     tags: [Trips]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of trips per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [scheduled, boarding, departed, in_transit, arrived, cancelled]
 *         description: Filter by trip status
 *       - in: query
 *         name: routeId
 *         schema:
 *           type: string
 *         description: Filter by route ID
 *       - in: query
 *         name: busId
 *         schema:
 *           type: string
 *         description: Filter by bus ID
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by trip date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of trips
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Trip'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     current:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     limit:
 *                       type: integer
 */

/**
 * @swagger
 * /api/v1/trips:
 *   post:
 *     summary: Create a new trip
 *     tags: [Trips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Trip'
 *           example:
 *             routeId: "RT1735656000000ABC12"
 *             busId: "BUS1735656000000XYZ34"
 *             driver:
 *               name: "Rajesh Fernando"
 *               licenseNumber: "DL987654321"
 *               phone: "+94-77-9876543"
 *             schedule:
 *               plannedStartTime: "2025-10-02T08:00:00.000Z"
 *               plannedEndTime: "2025-10-02T14:00:00.000Z"
 *               departureDelay: 0
 *               arrivalDelay: 0
 *             passengers:
 *               current: 0
 *               capacity: 50
 *               boarding: 0
 *               alighting: 0
 *             status: "scheduled"
 *             progress:
 *               percentage: 0
 *               currentLocation:
 *                 latitude: 6.9271
 *                 longitude: 79.8612
 *               nextStop: "Kadawatha"
 *               estimatedArrival: "2025-10-02T08:30:00.000Z"
 *     responses:
 *       201:
 *         description: Trip created successfully
 *       400:
 *         description: Bad request - Invalid input data or Route/Bus not found
 */

/**
 * @swagger
 * /api/v1/trips/{id}:
 *   get:
 *     summary: Get trip by ID
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Trip ID
 *     responses:
 *       200:
 *         description: Trip details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trip'
 *       404:
 *         description: Trip not found
 */

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
 *         description: Trip ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Trip'
 *     responses:
 *       200:
 *         description: Trip updated successfully
 *       404:
 *         description: Trip not found
 */

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
 *         description: Trip ID
 *     responses:
 *       200:
 *         description: Trip deleted successfully
 *       404:
 *         description: Trip not found
 */

/**
 * @swagger
 * /api/v1/trips/active:
 *   get:
 *     summary: Get all active trips
 *     tags: [Trips]
 *     responses:
 *       200:
 *         description: List of active trips
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Trip'
 *                 count:
 *                   type: integer
 */

/**
 * @swagger
 * /api/v1/trips/stats:
 *   get:
 *     summary: Get trip statistics
 *     tags: [Trips]
 *     responses:
 *       200:
 *         description: Trip statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     active:
 *                       type: integer
 *                     byStatus:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           count:
 *                             type: integer
 */

/**
 * @swagger
 * /api/v1/trips/route/{routeId}/date/{date}:
 *   get:
 *     summary: Get trips by route and date
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: routeId
 *         schema:
 *           type: string
 *         required: true
 *         description: Route ID
 *       - in: path
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: List of trips for the route and date
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Trip'
 */

/**
 * @swagger
 * /api/v1/trips/{id}/progress:
 *   post:
 *     summary: Update trip progress
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Trip ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               percentage:
 *                 type: number
 *                 example: 75.5
 *               currentLocation:
 *                 type: object
 *                 properties:
 *                   latitude:
 *                     type: number
 *                     example: 7.1500
 *                   longitude:
 *                     type: number
 *                     example: 80.3000
 *               nextStop:
 *                 type: string
 *                 example: "Peradeniya"
 *               estimatedArrival:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-10-02T13:30:00.000Z"
 *               passengers:
 *                 type: object
 *                 properties:
 *                   current:
 *                     type: integer
 *                     example: 28
 *                   boarding:
 *                     type: integer
 *                     example: 3
 *                   alighting:
 *                     type: integer
 *                     example: 5
 *     responses:
 *       200:
 *         description: Trip progress updated successfully
 *       404:
 *         description: Trip not found
 */

/**
 * @swagger
 * /api/v1/trips/{id}/incident:
 *   post:
 *     summary: Add incident to trip
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Trip ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - description
 *               - severity
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [delay, breakdown, accident, traffic]
 *                 example: "traffic"
 *               description:
 *                 type: string
 *                 example: "Heavy traffic due to road construction"
 *               severity:
 *                 type: string
 *                 enum: [low, medium, high, critical]
 *                 example: "medium"
 *               location:
 *                 type: object
 *                 properties:
 *                   latitude:
 *                     type: number
 *                   longitude:
 *                     type: number
 *               estimatedDelay:
 *                 type: integer
 *                 example: 15
 *                 description: "Estimated delay in minutes"
 *     responses:
 *       200:
 *         description: Incident added successfully
 *       404:
 *         description: Trip not found
 */

/**
 * @swagger
 * /api/v1/trips/{id}/complete:
 *   post:
 *     summary: Complete trip
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Trip ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               actualEndTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-10-02T14:15:00.000Z"
 *               finalLocation:
 *                 type: object
 *                 properties:
 *                   latitude:
 *                     type: number
 *                     example: 7.2906
 *                   longitude:
 *                     type: number
 *                     example: 80.6337
 *               totalPassengers:
 *                 type: integer
 *                 example: 45
 *               feedback:
 *                 type: string
 *                 example: "Trip completed successfully with minor delay"
 *     responses:
 *       200:
 *         description: Trip completed successfully
 *       404:
 *         description: Trip not found
 *       400:
 *         description: Trip cannot be completed (invalid status)
 */

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

// PUT /api/v1/trips/:id - Update trip
router.put('/:id', TripController.updateTrip);

// POST /api/v1/trips/:id/progress - Update trip progress
router.post('/:id/progress', TripController.updateTripProgress);

// POST /api/v1/trips/:id/incident - Add incident to trip
router.post('/:id/incident', TripController.addTripIncident);

// POST /api/v1/trips/:id/complete - Complete trip
router.post('/:id/complete', TripController.completeTrip);

// DELETE /api/v1/trips/:id - Delete trip
router.delete('/:id', TripController.deleteTrip);

module.exports = router;
