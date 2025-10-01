const express = require('express');
const router = express.Router();
const BusController = require('../controllers/busController');
const { validateRequest, busValidationSchema, locationUpdateSchema } = require('../middleware/validation');

// GET /api/v1/buses - Get all buses
router.get('/', BusController.getAllBuses);

// GET /api/v1/buses/stats - Get bus statistics
router.get('/stats', BusController.getBusStats);

// GET /api/v1/buses/status/:status - Get buses by status
router.get('/status/:status', BusController.getBusesByStatus);

// GET /api/v1/buses/near - Get buses near a location
router.get('/near', BusController.getBusesNearLocation);

// GET /api/v1/buses/:id - Get bus by ID
router.get('/:id', BusController.getBusById);

// GET /api/v1/buses/:id/history - Get bus location history
router.get('/:id/history', BusController.getBusLocationHistory);

// GET /api/v1/buses/:id/trip - Get current trip for bus
router.get('/:id/trip', BusController.getBusCurrentTrip);

// POST /api/v1/buses - Create new bus
router.post('/', validateRequest(busValidationSchema), BusController.createBus);

// PUT /api/v1/buses/:id - Update bus
router.put('/:id', validateRequest(busValidationSchema), BusController.updateBus);

// POST /api/v1/buses/:id/location - Update bus location
router.post('/:id/location', validateRequest(locationUpdateSchema), BusController.updateBusLocation);

// DELETE /api/v1/buses/:id - Delete bus
router.delete('/:id', BusController.deleteBus);

module.exports = router;
