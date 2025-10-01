const Route = require('../models/Route');
const { validateRequest, routeValidationSchema } = require('../middleware/validation');

class RouteController {
  // Get all routes
  static async getAllRoutes(req, res, next) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        status = 'active',
        origin,
        destination,
        sortBy = 'routeName',
        sortOrder = 'asc'
      } = req.query;

      const query = { status };
      
      // Add search filters
      if (origin) {
        query['origin.city'] = new RegExp(origin, 'i');
      }
      if (destination) {
        query['destination.city'] = new RegExp(destination, 'i');
      }

      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const routes = await Route.find(query)
        .sort(sortOptions)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select('-locationHistory -metadata.version');

      const total = await Route.countDocuments(query);

      res.json({
        success: true,
        data: routes,
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

  // Get route by ID
  static async getRouteById(req, res, next) {
    try {
      const { id } = req.params;
      
      const route = await Route.findOne({ routeId: id });
      
      if (!route) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Route not found',
            statusCode: 404
          }
        });
      }

      res.json({
        success: true,
        data: route
      });
    } catch (error) {
      next(error);
    }
  }

  // Create new route
  static async createRoute(req, res, next) {
    try {
      const routeData = req.body;
      
      // Generate unique route ID
      routeData.routeId = `RT${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      
      const route = new Route(routeData);
      await route.save();

      res.status(201).json({
        success: true,
        data: route,
        message: 'Route created successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Update route
  static async updateRoute(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const route = await Route.findOneAndUpdate(
        { routeId: id },
        updateData,
        { new: true, runValidators: true }
      );

      if (!route) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Route not found',
            statusCode: 404
          }
        });
      }

      res.json({
        success: true,
        data: route,
        message: 'Route updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete route
  static async deleteRoute(req, res, next) {
    try {
      const { id } = req.params;

      const route = await Route.findOneAndDelete({ routeId: id });

      if (!route) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Route not found',
            statusCode: 404
          }
        });
      }

      res.json({
        success: true,
        message: 'Route deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Search routes by origin and destination
  static async searchRoutes(req, res, next) {
    try {
      const { origin, destination } = req.query;

      if (!origin || !destination) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Origin and destination are required',
            statusCode: 400
          }
        });
      }

      const routes = await Route.findByOriginDestination(origin, destination);

      res.json({
        success: true,
        data: routes,
        count: routes.length
      });
    } catch (error) {
      next(error);
    }
  }

  // Get route statistics
  static async getRouteStats(req, res, next) {
    try {
      const stats = await Route.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      const totalRoutes = await Route.countDocuments();
      const activeRoutes = await Route.countDocuments({ status: 'active' });

      res.json({
        success: true,
        data: {
          total: totalRoutes,
          active: activeRoutes,
          byStatus: stats
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get routes near a location
  static async getRoutesNearLocation(req, res, next) {
    try {
      const { latitude, longitude, maxDistance = 10000 } = req.query;

      if (!latitude || !longitude) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Latitude and longitude are required',
            statusCode: 400
          }
        });
      }

      const routes = await Route.find({
        $or: [
          {
            'origin.coordinates': {
              $near: {
                $geometry: {
                  type: 'Point',
                  coordinates: [parseFloat(longitude), parseFloat(latitude)]
                },
                $maxDistance: parseInt(maxDistance)
              }
            }
          },
          {
            'destination.coordinates': {
              $near: {
                $geometry: {
                  type: 'Point',
                  coordinates: [parseFloat(longitude), parseFloat(latitude)]
                },
                $maxDistance: parseInt(maxDistance)
              }
            }
          }
        ],
        status: 'active'
      });

      res.json({
        success: true,
        data: routes,
        count: routes.length
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RouteController;
