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
 *       properties:
 *         routeId:
 *           type: string
 *           description: Auto-generated route ID
 *         routeName:
 *           type: string
 *           description: Name of the route
 *         origin:
 *           type: object
 *           properties:
 *             city:
 *               type: string
 *             province:
 *               type: string
 *             coordinates:
 *               type: object
 *               properties:
 *                 latitude:
 *                   type: number
 *                 longitude:
 *                   type: number
 *         destination:
 *           type: object
 *           properties:
 *             city:
 *               type: string
 *             province:
 *               type: string
 *             coordinates:
 *               type: object
 *               properties:
 *                 latitude:
 *                   type: number
 *                 longitude:
 *                   type: number
 *         distance:
 *           type: number
 *           description: Distance in kilometers
 *         estimatedDuration:
 *           type: number
 *           description: Duration in minutes
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
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of routes per page
 *     responses:
 *       200:
 *         description: List of routes
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
 *             routeName: "Colombo - Kandy Express"
 *             origin:
 *               city: "Colombo"
 *               province: "Western"
 *               coordinates:
 *                 latitude: 6.9271
 *                 longitude: 79.8612
 *             destination:
 *               city: "Kandy"
 *               province: "Central"
 *               coordinates:
 *                 latitude: 7.2906
 *                 longitude: 80.6337
 *             distance: 115
 *             estimatedDuration: 180
 *     responses:
 *       201:
 *         description: Route created successfully
 *       400:
 *         description: Bad request
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
