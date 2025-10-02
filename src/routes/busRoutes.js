/**
 * @swagger
 * components:
 *   schemas:
 *     Bus:
 *       type: object
 *       required:
 *         - registrationNumber
 *         - routeId
 *         - operator
 *         - vehicleInfo
 *         - driver
 *       properties:
 *         busId:
 *           type: string
 *           description: Auto-generated bus ID
 *           example: "BUS1735656000000XYZ34"
 *         registrationNumber:
 *           type: string
 *           description: Vehicle registration number (must be unique)
 *           example: "WP-AB-1234"
 *         routeId:
 *           type: string
 *           description: Associated route ID
 *           example: "RT1735656000000ABC12"
 *         operator:
 *           type: object
 *           required: [name]
 *           properties:
 *             name:
 *               type: string
 *               example: "Express Transport Services"
 *             contact:
 *               type: object
 *               properties:
 *                 phone:
 *                   type: string
 *                   example: "+94-11-9876543"
 *                 email:
 *                   type: string
 *                   example: "info@express.lk"
 *         vehicleInfo:
 *           type: object
 *           required: [make, model, year, capacity]
 *           properties:
 *             make:
 *               type: string
 *               example: "Ashok Leyland"
 *             model:
 *               type: string
 *               example: "Viking"
 *             year:
 *               type: integer
 *               minimum: 1990
 *               example: 2022
 *             capacity:
 *               type: integer
 *               minimum: 1
 *               maximum: 100
 *               example: 50
 *             features:
 *               type: array
 *               items:
 *                 type: string
 *                 enum: [ac, wifi, usb_charging, gps_tracking, cctv, wheelchair_accessible]
 *               example: ["ac", "wifi", "gps_tracking", "cctv"]
 *         driver:
 *           type: object
 *           required: [name, licenseNumber]
 *           properties:
 *             name:
 *               type: string
 *               example: "Kumar Perera"
 *             licenseNumber:
 *               type: string
 *               example: "DL123456789"
 *             contact:
 *               type: object
 *               properties:
 *                 phone:
 *                   type: string
 *                   example: "+94-77-1234567"
 *             experience:
 *               type: integer
 *               minimum: 0
 *               example: 5
 *         currentStatus:
 *           type: object
 *           readOnly: true
 *           description: "Set automatically by the system"
 *           properties:
 *             status:
 *               type: string
 *               enum: [active, inactive, maintenance, offline]
 *               example: "inactive"
 *             location:
 *               type: object
 *               properties:
 *                 latitude:
 *                   type: number
 *                 longitude:
 *                   type: number
 *                 lastUpdated:
 *                   type: string
 *                   format: date-time
 *     LocationUpdate:
 *       type: object
 *       required: [latitude, longitude]
 *       properties:
 *         latitude:
 *           type: number
 *           minimum: -90
 *           maximum: 90
 *           example: 6.9271
 *         longitude:
 *           type: number
 *           minimum: -180
 *           maximum: 180
 *           example: 79.8612
 *         speed:
 *           type: number
 *           minimum: 0
 *           maximum: 200
 *           example: 45
 *         direction:
 *           type: number
 *           minimum: 0
 *           maximum: 360
 *           example: 180
 *         accuracy:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           example: 5
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
 *         description: Page number for pagination
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
 *           enum: [active, inactive, maintenance, offline]
 *         description: Filter by bus status
 *     responses:
 *       200:
 *         description: List of buses retrieved successfully
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
 *                     $ref: '#/components/schemas/Bus'
 */

/**
 * @swagger
 * /api/v1/buses:
 *   post:
 *     summary: Create a new bus
 *     description: Creates a new bus. Note - currentStatus and location are set automatically by the system.
 *     tags: [Buses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [registrationNumber, routeId, operator, vehicleInfo, driver]
 *             properties:
 *               registrationNumber:
 *                 type: string
 *                 example: "WP-XX-9995"
 *               routeId:
 *                 type: string
 *                 example: "RT1735656000000ABC12"
 *               operator:
 *                 $ref: '#/components/schemas/Bus/properties/operator'
 *               vehicleInfo:
 *                 $ref: '#/components/schemas/Bus/properties/vehicleInfo'
 *               driver:
 *                 $ref: '#/components/schemas/Bus/properties/driver'
 *           example:
 *             registrationNumber: "WP-XX-9995"
 *             routeId: "RT1735656000000ABC12"
 *             operator:
 *               name: "Express Transport Services"
 *               contact:
 *                 phone: "+94-11-9876543"
 *                 email: "info@express.lk"
 *             vehicleInfo:
 *               make: "Ashok Leyland"
 *               model: "Viking"
 *               year: 2022
 *               capacity: 50
 *               features: ["ac", "wifi", "gps_tracking", "cctv"]
 *             driver:
 *               name: "Kumar Perera"
 *               licenseNumber: "DL123456789"
 *               contact:
 *                 phone: "+94-77-1234567"
 *               experience: 5
 *     responses:
 *       201:
 *         description: Bus created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Bus'
 *                 message:
 *                   type: string
 *                   example: "Bus created successfully"
 *       400:
 *         description: Bad request - Invalid input data or validation error
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
 *         description: Bus ID (e.g., BUS1735656000000XYZ34)
 *     responses:
 *       200:
 *         description: Bus retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Bus'
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
 * /api/v1/buses/{id}/location:
 *   post:
 *     summary: Update bus current location
 *     description: Updates the real-time location of a bus. Emits Socket.IO event for live tracking.
 *     tags: [Buses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Bus ID (e.g., BUS1735656000000XYZ34)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LocationUpdate'
 *           example:
 *             latitude: 6.9500
 *             longitude: 79.8800
 *             speed: 45
 *             direction: 180
 *             accuracy: 5
 *     responses:
 *       200:
 *         description: Bus location updated successfully
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
 *                     busId:
 *                       type: string
 *                     location:
 *                       type: object
 *                       properties:
 *                         latitude:
 *                           type: number
 *                         longitude:
 *                           type: number
 *                         lastUpdated:
 *                           type: string
 *                           format: date-time
 *                 message:
 *                   type: string
 *                   example: "Bus location updated successfully"
 *       400:
 *         description: Bad request - Invalid coordinates or validation error
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
 *         description: Bus statistics retrieved successfully
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
 *           enum: [active, inactive, maintenance, offline]
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
 *         description: Bus location history retrieved successfully
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
 *                       direction:
 *                         type: number
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
 *         description: Current trip information retrieved successfully
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
 *         description: No active trip found for this bus
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
