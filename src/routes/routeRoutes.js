/**
 * @swagger
 * components:
 *   schemas:
 *     Route:
 *       type: object
 *       required:
 *         - routeName
 *         - origin
 *         - destination
 *         - distance
 *         - estimatedDuration
 *         - operator
 *         - schedule
 *       properties:
 *         routeId:
 *           type: string
 *           description: Auto-generated route ID
 *           example: "RT1735656000000ABC12"
 *         routeName:
 *           type: string
 *           description: Name of the route
 *           example: "Colombo - Kandy Express"
 *         origin:
 *           type: object
 *           properties:
 *             city:
 *               type: string
 *               example: "Colombo"
 *             province:
 *               type: string
 *               example: "Western"
 *             coordinates:
 *               type: object
 *               properties:
 *                 latitude:
 *                   type: number
 *                   example: 6.9271
 *                 longitude:
 *                   type: number
 *                   example: 79.8612
 *         destination:
 *           type: object
 *           properties:
 *             city:
 *               type: string
 *               example: "Kandy"
 *             province:
 *               type: string
 *               example: "Central"
 *             coordinates:
 *               type: object
 *               properties:
 *                 latitude:
 *                   type: number
 *                   example: 7.2906
 *                 longitude:
 *                   type: number
 *                   example: 80.6337
 *         distance:
 *           type: number
 *           description: Distance in kilometers
 *           example: 115
 *         estimatedDuration:
 *           type: number
 *           description: Duration in minutes
 *           example: 180
 *         waypoints:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Kadawatha"
 *               coordinates:
 *                 type: object
 *                 properties:
 *                   latitude:
 *                     type: number
 *                   longitude:
 *                     type: number
 *               order:
 *                 type: integer
 *                 example: 1
 *         operator:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: "Sri Lanka Transport Board"
 *             contact:
 *               type: object
 *               properties:
 *                 phone:
 *                   type: string
 *                   example: "+94-11-2345678"
 *                 email:
 *                   type: string
 *                   example: "info@sltb.lk"
 *         schedule:
 *           type: object
 *           properties:
 *             frequency:
 *               type: string
 *               enum: [hourly, daily, weekly]
 *               example: "daily"
 *             operatingDays:
 *               type: array
 *               items:
 *                 type: string
 *                 enum: [monday, tuesday, wednesday, thursday, friday, saturday, sunday]
 *               example: ["monday", "tuesday", "wednesday", "thursday", "friday"]
 *             firstTrip:
 *               type: string
 *               pattern: "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
 *               example: "05:00"
 *             lastTrip:
 *               type: string
 *               pattern: "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
 *               example: "22:00"
 */

/**
 * @swagger
 * /api/v1/routes:
 *   get:
 *     summary: Get all routes
 *     tags: [Routes]
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
 *         description: Number of routes per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, maintenance]
 *         description: Filter by route status
 *     responses:
 *       200:
 *         description: List of routes retrieved successfully
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
 *                     $ref: '#/components/schemas/Route'
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
 * /api/v1/routes:
 *   post:
 *     summary: Create a new route
 *     tags: [Routes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Route'
 *           example:
 *             routeName: "Colombo - Jaffna Express"
 *             origin:
 *               city: "Colombo"
 *               province: "Western"
 *               coordinates:
 *                 latitude: 6.9271
 *                 longitude: 79.8612
 *             destination:
 *               city: "Jaffna"
 *               province: "Northern"
 *               coordinates:
 *                 latitude: 9.6615
 *                 longitude: 80.0255
 *             distance: 400
 *             estimatedDuration: 480
 *             waypoints:
 *               - name: "Anuradhapura"
 *                 coordinates:
 *                   latitude: 8.3114
 *                   longitude: 80.4037
 *                 order: 1
 *             operator:
 *               name: "Sri Lanka Transport Board"
 *               contact:
 *                 phone: "+94-11-2345678"
 *                 email: "info@sltb.lk"
 *             schedule:
 *               frequency: "daily"
 *               operatingDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
 *               firstTrip: "05:00"
 *               lastTrip: "20:00"
 *     responses:
 *       201:
 *         description: Route created successfully
 *       400:
 *         description: Bad request - Invalid input data
 */

/**
 * @swagger
 * /api/v1/routes/{id}:
 *   get:
 *     summary: Get route by ID
 *     tags: [Routes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Route ID (e.g., RT1735656000000ABC12)
 *     responses:
 *       200:
 *         description: Route retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Route'
 *       404:
 *         description: Route not found
 */

/**
 * @swagger
 * /api/v1/routes/{id}:
 *   put:
 *     summary: Update route
 *     tags: [Routes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Route ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Route'
 *     responses:
 *       200:
 *         description: Route updated successfully
 *       404:
 *         description: Route not found
 */

/**
 * @swagger
 * /api/v1/routes/{id}:
 *   delete:
 *     summary: Delete route
 *     tags: [Routes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Route ID
 *     responses:
 *       200:
 *         description: Route deleted successfully
 *       404:
 *         description: Route not found
 */

/**
 * @swagger
 * /api/v1/routes/search:
 *   get:
 *     summary: Search routes by origin and destination
 *     tags: [Routes]
 *     parameters:
 *       - in: query
 *         name: origin
 *         schema:
 *           type: string
 *         description: Origin city name
 *         example: "Colombo"
 *       - in: query
 *         name: destination
 *         schema:
 *           type: string
 *         description: Destination city name
 *         example: "Kandy"
 *     responses:
 *       200:
 *         description: Search results
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
 *                     $ref: '#/components/schemas/Route'
 */

/**
 * @swagger
 * /api/v1/routes/stats:
 *   get:
 *     summary: Get route statistics
 *     tags: [Routes]
 *     responses:
 *       200:
 *         description: Route statistics
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
 * /api/v1/routes/near:
 *   get:
 *     summary: Get routes near a location
 *     tags: [Routes]
 *     parameters:
 *       - in: query
 *         name: latitude
 *         schema:
 *           type: number
 *         required: true
 *         description: Latitude coordinate
 *         example: 6.9271
 *       - in: query
 *         name: longitude
 *         schema:
 *           type: number
 *         required: true
 *         description: Longitude coordinate
 *         example: 79.8612
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           default: 10
 *         description: Search radius in kilometers
 *     responses:
 *       200:
 *         description: List of nearby routes
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
 *                     $ref: '#/components/schemas/Route'
 */

const express = require('express');
const router = express.Router();
const RouteController = require('../controllers/routeController');
const { validateRequest, routeValidationSchema } = require('../middleware/validation');

router.get('/', RouteController.getAllRoutes);
router.get('/search', RouteController.searchRoutes);
router.get('/stats', RouteController.getRouteStats);
router.get('/near', RouteController.getRoutesNearLocation);
router.get('/:id', RouteController.getRouteById);
router.post('/', validateRequest(routeValidationSchema), RouteController.createRoute);
router.put('/:id', validateRequest(routeValidationSchema), RouteController.updateRoute);
router.delete('/:id', RouteController.deleteRoute);

module.exports = router;
