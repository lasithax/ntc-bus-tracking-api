const express = require("express");
const router = express.Router();
const TripController = require("../controllers/tripController");
const {
  validateRequest,
  tripValidationSchema,
} = require("../middleware/validation");

/**
 * @swagger
 * /api/v1/trips:
 *   get:
 *     summary: Get all trips
 *     tags: [Trips]
 *     responses:
 *       200:
 *         description: List of all trips
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trip'
 *   post:
 *     summary: Create new trip
 *     tags: [Trips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Trip'
 *           example:
 *             routeId: "ROU1735656000000ABC12"
 *             schedule:
 *               plannedStartTime: "2025-10-03T09:00:00.000Z"
 *               plannedEndTime: "2025-10-03T12:00:00.000Z"
 *             passengers:
 *               total: 40
 *     responses:
 *       201:
 *         description: Trip created successfully
 */
// GET /api/v1/trips - Get all trips
router.get("/", TripController.getAllTrips);

/**
 * @swagger
 * /api/v1/trips/active:
 *   get:
 *     summary: Get active trips
 *     tags: [Trips]
 *     responses:
 *       200:
 *         description: List of active trips
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trip'
 */
// GET /api/v1/trips/active - Get active trips
router.get("/active", TripController.getActiveTrips);

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
 *                 totalTrips:
 *                   type: integer
 *                   example: 120
 *                 activeTrips:
 *                   type: integer
 *                   example: 8
 *                 completedTrips:
 *                   type: integer
 *                   example: 95
 */
// GET /api/v1/trips/stats - Get trip statistics
router.get("/stats", TripController.getTripStats);

/**
 * @swagger
 * /api/v1/trips/route/{routeId}/date/{date}:
 *   get:
 *     summary: Get trips by route and date
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: routeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Route ID (e.g., ROU1735656000000ABC12)
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Trips filtered by route and date
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trip'
 */
// GET /api/v1/trips/route/:routeId/date/:date - Get trips by route and date
router.get("/route/:routeId/date/:date", TripController.getTripsByRouteAndDate);

/**
 * @swagger
 * /api/v1/trips/{id}:
 *   get:
 *     summary: Get trip by ID
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Trip ID (e.g., TRP1735656000000DEF56)
 *     responses:
 *       200:
 *         description: Trip details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trip'
 *       404:
 *         description: Trip not found
 */
// GET /api/v1/trips/:id - Get trip by ID
router.get("/:id", TripController.getTripById);

// POST /api/v1/trips - Create new trip
router.post(
  "/",
  validateRequest(tripValidationSchema),
  TripController.createTrip
);

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
router.put("/:id", TripController.updateTrip);

// POST /api/v1/trips/:id/progress - Update trip progress
router.post("/:id/progress", TripController.updateTripProgress);

// POST /api/v1/trips/:id/incident - Add incident to trip
router.post("/:id/incident", TripController.addTripIncident);

// POST /api/v1/trips/:id/complete - Complete trip
router.post("/:id/complete", TripController.completeTrip);

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
router.delete("/:id", TripController.deleteTrip);

module.exports = router;
