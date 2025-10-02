/**
 * @swagger
 * components:
 *   schemas:
 *     Bus:
 *       type: object
 *       required:
 *         - registrationNumber
 *         - vehicleInfo
 *         - operator
 *         - driver
 *         - currentLocation
 *         - status
 *       properties:
 *         busId:
 *           type: string
 *           description: Auto-generated bus ID
 *           example: "BUS1735656000000XYZ34"
 *         registrationNumber:
 *           type: string
 *           description: Vehicle registration number
 *           example: "WP-AB-1234"
 *         vehicleInfo:
 *           type: object
 *           properties:
 *             make:
 *               type: string
 *               example: "Tata"
 *             model:
 *               type: string
 *               example: "Starbus"
 *             year:
 *               type: integer
 *               example: 2020
 *             capacity:
 *               type: integer
 *               example: 45
 *             fuelType:
 *               type: string
 *               enum: [diesel, petrol, electric]
 *               example: "diesel"
 *             engineNumber:
 *               type: string
 *               example: "TATA2020SB001"
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
 *         driver:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: "Kamal Perera"
 *             licenseNumber:
 *               type: string
 *               example: "DL123456789"
 *             phone:
 *               type: string
 *               example: "+94-77-1234567"
 *             experience:
 *               type: integer
 *               example: 5
 *         currentLocation:
 *           type: object
 *           properties:
 *             latitude:
 *               type: number
 *               example: 6.9271
 *             longitude:
 *               type: number
 *               example: 79.8612
 *             address:
 *               type: string
 *               example: "Colombo Fort Bus Stand"
 *             timestamp:
 *               type: string
 *               format: date-time
 *               example: "2025-10-01T12:00:00.000Z"
 *             speed:
 *               type: number
 *               example: 45.5
 *             heading:
 *               type: integer
 *               example: 180
 *         status:
 *           type: string
 *           enum: [available, in_service, maintenance, retired]
 *           example: "available"
 *         currentTrip:
 *           type: object
 *           properties:
 *             tripId:
 *               type: string
 *               example: "TRP1735656000000DEF56"
 *             startTime:
 *               type: string
 *               format: date-time
 *             expectedEndTime:
 *               type: string
 *               format: date-time
 *             progress:
 *               type: number
 *               example: 50.5
 *         locationHistory:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *               speed:
 *                 type: number
 *               heading:
 *                 type: integer
 */

/**
 * @swagger
 * /api/v1/buses:
 *   get:
 *     summary: Get all buses
 *     tags: [Buses]
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
 *         description: Number of buses per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [available, in_service, maintenance, retired]
 *         description: Filter by bus status
 *     responses:
 *       200:
 *         description: List of buses
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
 *                     $ref: '#/components/schemas/Bus'
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
 * /api/v1/buses:
 *   post:
 *     summary: Create a new bus
 *     tags: [Buses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bus'
 *           example:
 *             registrationNumber: "WP-XX-9999"
 *             vehicleInfo:
 *               make: "Ashok Leyland"
 *               model: "Viking"
 *               year: 2022
 *               capacity: 50
 *               fuelType: "diesel"
 *               engineNumber: "AL2022VK001"
 *             operator:
 *               name: "Express Transport Services"
 *               contact:
 *                 phone: "+94-11-9876543"
 *                 email: "info@express.lk"
 *             driver:
 *               name: "Kumar Perera"
 *               licenseNumber: "DL123456789"
 *               phone: "+94-77-1234567"
 *               experience: 5
 *             currentLocation:
 *               latitude: 6.9271
 *               longitude: 79.8612
 *               address: "Colombo Fort Bus Stand"
 *               timestamp: "2025-10-01T12:00:00.000Z"
 *             status: "available"
 *     responses:
 *       201:
 *         description: Bus created successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/v1/buses/{id}:
 *   get:
 *     summary: Get bus by ID
 *     tags: [Buses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Bus ID
 *     responses:
 *       200:
 *         description: Bus details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bus'
 *       404:
 *         description: Bus not found
 */

/**
 * @swagger
 * /api/v1/buses/{id}:
 *   put:
 *     summary: Update bus
 *     tags: [Buses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Bus ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bus'
 *     responses:
 *       200:
 *         description: Bus updated successfully
 *       404:
 *         description: Bus not found
 */

/**
 * @swagger
 * /api/v1/buses/{id}:
 *   delete:
 *     summary: Delete bus
 *     tags: [Buses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Bus ID
 *     responses:
 *       200:
 *         description: Bus deleted successfully
 *       404:
 *         description: Bus not found
 */

/**
 * @swagger
 * /api/v1/buses/stats:
 *   get:
 *     summary: Get bus statistics
 *     tags: [Buses]
 *     responses:
 *       200:
 *         description: Bus statistics
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
 * /api/v1/buses/status/{status}:
 *   get:
 *     summary: Get buses by status
 *     tags: [Buses]
 *     parameters:
 *       - in: path
 *         name: status
 *         schema:
 *           type: string
 *           enum: [available, in_service, maintenance, retired]
 *         required: true
 *         description: Bus status
 *     responses:
 *       200:
 *         description: List of buses with specified status
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
 *                     $ref: '#/components/schemas/Bus'
 */

/**
 * @swagger
 * /api/v1/buses/near:
 *   get:
 *     summary: Get buses near a location
 *     tags: [Buses]
 *     parameters:
 *       - in: query
 *         name: latitude
 *         schema:
 *           type: number
 *         required: true
 *         description: Latitude coordinate
 *       - in: query
 *         name: longitude
 *         schema:
 *           type: number
 *         required: true
 *         description: Longitude coordinate
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           default: 5
 *         description: Search radius in kilometers
 *     responses:
 *       200:
 *         description: List of nearby buses
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
 *                     $ref: '#/components/schemas/Bus'
 */

/**
 * @swagger
 * /api/v1/buses/{id}/history:
 *   get:
 *     summary: Get bus location history
 *     tags: [Buses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Bus ID
 *       - in: query
 *         name: hours
 *         schema:
 *           type: integer
 *           default: 24
 *         description: Number of hours to look back
 *     responses:
 *       200:
 *         description: Bus location history
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
 *                     type: object
 *                     properties:
 *                       latitude:
 *                         type: number
 *                       longitude:
 *                         type: number
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                       speed:
 *                         type: number
 *                       heading:
 *                         type: integer
 */

/**
 * @swagger
 * /api/v1/buses/{id}/trip:
 *   get:
 *     summary: Get current trip for bus
 *     tags: [Buses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Bus ID
 *     responses:
 *       200:
 *         description: Current trip information
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
 *         description: No active trip found
 */

/**
 * @swagger
 * /api/v1/buses/{id}/location:
 *   post:
 *     summary: Update bus location
 *     tags: [Buses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Bus ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - latitude
 *               - longitude
 *               - timestamp
 *             properties:
 *               latitude:
 *                 type: number
 *                 example: 6.9500
 *               longitude:
 *                 type: number
 *                 example: 79.8800
 *               address:
 *                 type: string
 *                 example: "Kadawatha Junction"
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-10-01T12:30:00.000Z"
 *               speed:
 *                 type: number
 *                 example: 45
 *               heading:
 *                 type: integer
 *                 example: 180
 *     responses:
 *       200:
 *         description: Location updated successfully
 *       404:
 *         description: Bus not found
 */

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
