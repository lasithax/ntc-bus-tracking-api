const Bus = require('../models/Bus');
const Trip = require('../models/Trip');
const { validateRequest, busValidationSchema, locationUpdateSchema } = require('../middleware/validation');

class BusController {
  // Get all buses
  static async getAllBuses(req, res, next) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        status,
        routeId,
        sortBy = 'registrationNumber',
        sortOrder = 'asc'
      } = req.query;

      const query = {};
      
      if (status) {
        query['currentStatus.status'] = status;
      }
      
      if (routeId) {
        query.routeId = routeId;
      }

      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const buses = await Bus.find(query)
        .sort(sortOptions)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select('-locationHistory -maintenance.issues');

      const total = await Bus.countDocuments(query);

      res.json({
        success: true,
        data: buses,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get bus by ID
  static async getBusById(req, res, next) {
    try {
      const { id } = req.params;
      
      const bus = await Bus.findOne({ busId: id });
      
      if (!bus) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Bus not found',
            statusCode: 404
          }
        });
      }

      res.json({
        success: true,
        data: bus
      });
    } catch (error) {
      next(error);
    }
  }

  // Create new bus
  static async createBus(req, res, next) {
    try {
      const busData = req.body;
      
      // Generate unique bus ID
      busData.busId = `BUS${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      
      const bus = new Bus(busData);
      await bus.save();

      res.status(201).json({
        success: true,
        data: bus,
        message: 'Bus created successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Update bus
  static async updateBus(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const bus = await Bus.findOneAndUpdate(
        { busId: id },
        updateData,
        { new: true, runValidators: true }
      );

      if (!bus) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Bus not found',
            statusCode: 404
          }
        });
      }

      res.json({
        success: true,
        data: bus,
        message: 'Bus updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete bus
  static async deleteBus(req, res, next) {
    try {
      const { id } = req.params;

      const bus = await Bus.findOneAndDelete({ busId: id });

      if (!bus) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Bus not found',
            statusCode: 404
          }
        });
      }

      res.json({
        success: true,
        message: 'Bus deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Update bus location
  static async updateBusLocation(req, res, next) {
    try {
      const { id } = req.params;
      const locationData = req.body;

      const bus = await Bus.findOne({ busId: id });
      
      if (!bus) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Bus not found',
            statusCode: 404
          }
        });
      }

      await bus.updateLocation(
        locationData.latitude,
        locationData.longitude,
        locationData.speed,
        locationData.direction
      );

      // Emit real-time update via Socket.IO
      req.app.get('io').emit('busLocationUpdate', {
        busId: bus.busId,
        location: {
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          timestamp: new Date()
        },
        speed: locationData.speed,
        direction: locationData.direction
      });

      res.json({
        success: true,
        data: {
          busId: bus.busId,
          location: bus.currentStatus.location,
          status: bus.currentStatus.status
        },
        message: 'Bus location updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Get bus location history
  static async getBusLocationHistory(req, res, next) {
    try {
      const { id } = req.params;
      const { startTime, endTime, limit = 100 } = req.query;

      const bus = await Bus.findOne({ busId: id });
      
      if (!bus) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Bus not found',
            statusCode: 404
          }
        });
      }

      let history = bus.locationHistory;

      if (startTime && endTime) {
        const start = new Date(startTime);
        const end = new Date(endTime);
        history = bus.getLocationHistory(start, end);
      }

      // Limit results
      history = history.slice(-parseInt(limit));

      res.json({
        success: true,
        data: {
          busId: bus.busId,
          history: history
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get buses by status
  static async getBusesByStatus(req, res, next) {
    try {
      const { status } = req.params;

      const buses = await Bus.findByStatus(status);

      res.json({
        success: true,
        data: buses,
        count: buses.length
      });
    } catch (error) {
      next(error);
    }
  }

  // Get buses near location
  static async getBusesNearLocation(req, res, next) {
    try {
      const { latitude, longitude, maxDistance = 1000 } = req.query;

      if (!latitude || !longitude) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Latitude and longitude are required',
            statusCode: 400
          }
        });
      }

      const buses = await Bus.findNearLocation(
        parseFloat(latitude),
        parseFloat(longitude),
        parseInt(maxDistance)
      );

      res.json({
        success: true,
        data: buses,
        count: buses.length
      });
    } catch (error) {
      next(error);
    }
  }

  // Get bus statistics
  static async getBusStats(req, res, next) {
    try {
      const stats = await Bus.aggregate([
        {
          $group: {
            _id: '$currentStatus.status',
            count: { $sum: 1 }
          }
        }
      ]);

      const totalBuses = await Bus.countDocuments();
      const activeBuses = await Bus.countDocuments({ 'currentStatus.status': 'active' });

      res.json({
        success: true,
        data: {
          total: totalBuses,
          active: activeBuses,
          byStatus: stats
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get current trip for bus
  static async getBusCurrentTrip(req, res, next) {
    try {
      const { id } = req.params;

      const bus = await Bus.findOne({ busId: id });
      
      if (!bus) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Bus not found',
            statusCode: 404
          }
        });
      }

      if (!bus.currentTrip.tripId) {
        return res.json({
          success: true,
          data: null,
          message: 'No active trip for this bus'
        });
      }

      const trip = await Trip.findOne({ tripId: bus.currentTrip.tripId });

      res.json({
        success: true,
        data: trip
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BusController;
