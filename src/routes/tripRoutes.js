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
 *         status:
 *           type: string
 *           enum: [scheduled, boarding, departed, in_transit, arrived, cancelled]
 *           example: "in_transit"
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
 *             status: "scheduled"
 *     responses:
 *       201:
 *         description: Trip created successfully
 *       400:
 *         description: Bad request - Invalid input data
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
