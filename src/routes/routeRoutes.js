const express = require('express');
const router = express.Router();
const RouteController = require('../controllers/routeController');
const { validateRequest, routeValidationSchema } = require('../middleware/validation');

// GET /api/v1/routes - Get all routes
router.get('/', RouteController.getAllRoutes);

// GET /api/v1/routes/search - Search routes by origin and destination
router.get('/search', RouteController.searchRoutes);

// GET /api/v1/routes/stats - Get route statistics
router.get('/stats', RouteController.getRouteStats);

// GET /api/v1/routes/near - Get routes near a location
router.get('/near', RouteController.getRoutesNearLocation);

// GET /api/v1/routes/:id - Get route by ID
router.get('/:id', RouteController.getRouteById);

// POST /api/v1/routes - Create new route
router.post('/', validateRequest(routeValidationSchema), RouteController.createRoute);

// PUT /api/v1/routes/:id - Update route
router.put('/:id', validateRequest(routeValidationSchema), RouteController.updateRoute);

// DELETE /api/v1/routes/:id - Delete route
router.delete('/:id', RouteController.deleteRoute);

module.exports = router;
