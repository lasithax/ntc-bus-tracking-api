/**
 * @swagger
 * components:
 *   schemas:
 *     Trip:
 *       type: object
 *       required:
 *         - routeId
 *         - busId
 *         - driverId
 *         - schedule
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
 *         driverId:
 *           type: string
 *           description: Driver identifier
 *           example: "DRV123456789"
 *         schedule:
 *           type: object
 *           required: [plannedStartTime, plannedEndTime]
 *           properties:
 *             plannedStartTime:
 *               type: string
 *               format: date-time
 *               example: "2025-10-03T08:00:00.000Z"
 *             plannedEndTime:
 *               type: string
 *               format: date-time
 *               example: "2025-10-03T11:00:00.000Z"
 *             actualStartTime:
 *               type: string
 *               format: date-time
 *               readOnly: true
 *             actualEndTime:
 *               type: string
 *               format: date-time
 *               readOnly: true
 *             departureDelay:
 *               type: number
 *               default: 0
 *               readOnly: true
 *             arrivalDelay:
 *               type: number
 *               default: 0
 *               readOnly: true
 *         passengers:
 *           type: object
 *           properties:
 *             total:
 *               type: number
 *               minimum: 0
 *               default: 0
 *               example: 15
 *             capacity:
 *               type: number
 *               minimum: 1
 *               maximum: 100
 *               example: 50
 *             occupancy:
 *               type: number
 *               minimum: 0
 *               maximum: 100
 *               readOnly: true
 *         status:
 *           type: string
 *           enum: [scheduled, boarding, departed, in_transit, arrived, completed, cancelled, delayed]
 *           default: "scheduled"
 *           readOnly: true
 *         progress:
 *           type: object
 *           readOnly: true
 *           properties:
 *             percentage:
 *               type: number
 *               minimum: 0
 *               maximum: 100
 *               default: 0
 *             currentStop:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 coordinates:
 *                   type: object
 *                   properties:
 *                     latitude:
 *                       type: number
 *                     longitude:
 *                       type: number
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
 *         description: Page number for pagination
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
 *           enum: [scheduled, boarding, departed, in_transit, arrived, completed, cancelled, delayed]
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
 *         description: List of trips retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
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
 *     description: Creates a new trip. Status, progress, and other fields are set automatically.
 *     tags: [Trips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [routeId, busId, driverId, schedule]
 *             properties:
 *               routeId:
 *                 type: string
 *                 example: "RT1735656000000ABC12"
 *               busId:
 *                 type: string
 *                 example: "BUS1735656000000XYZ34"
 *               driverId:
 *                 type: string
 *                 example: "DRV123456789"
 *               schedule:
 *                 type: object
 *                 required: [plannedStartTime, plannedEndTime]
 *                 properties:
 *                   plannedStartTime:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-10-03T08:00:00.000Z"
 *                   plannedEndTime:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-10-03T11:00:00.000Z"
 *               passengers:
 *                 type: object
 *                 properties:
 *                   total:
 *                     type: number
 *                     minimum: 0
 *                     default: 0
 *                     example: 0
 *                   capacity:
 *                     type: number
 *                     minimum: 1
 *                     maximum: 100
 *                     example: 50
 *           example:
 *             routeId: "RT1735656000000ABC12"
 *             busId: "BUS1735656000000XYZ34"
 *             driverId: "DRV123456789"
 *             schedule:
 *               plannedStartTime: "2025-10-03T08:00:00.000Z"
 *               plannedEndTime: "2025-10-03T11:00:00.000Z"
 *             passengers:
 *               total: 0
 *               capacity: 50
 *     responses:
 *       201:
 *         description: Trip created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Trip'
 *                 message:
 *                   type: string
 *                   example: "Trip created successfully"
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
 *         description: Trip ID (e.g., TRP1735656000000DEF56)
 *     responses:
 *       200:
 *         description: Trip retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Trip'
 *       404:
 *         description: Trip not found
 */

/**
 * @swagger
 * /api/v1/trips/active:
 *   get:
 *     summary: Get all active trips
 *     description: Returns trips with status - boarding, departed, in_transit
 *     tags: [Trips]
 *     responses:
 *       200:
 *         description: List of active trips retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Trip'
 *                 count:
 *                   type: integer
 *                   example: 5
 */

/**
 * @swagger
 * /api/v1/trips/stats:
 *   get:
 *     summary: Get trip statistics
 *     tags: [Trips]
 *     responses:
 *       200:
 *         description: Trip statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 100
 *                     active:
 *                       type: integer
 *                       example: 20
 *                     byStatus:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "scheduled"
 *                           count:
 *                             type: integer
 *                             example: 50
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

// GET /api/v1/trips/:id - Get trip by ID
router.get('/:id', TripController.getTripById);

// POST /api/v1/trips - Create new trip
router.post('/', validateRequest(tripValidationSchema), TripController.createTrip);

module.exports = router;
