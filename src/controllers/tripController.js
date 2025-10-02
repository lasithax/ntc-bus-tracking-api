const Trip = require("../models/Trip");
const Bus = require("../models/Bus");
const Route = require("../models/Route");
const {
  validateRequest,
  tripValidationSchema,
} = require("../middleware/validation");

class TripController {
  // Get all trips
  static async getAllTrips(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        routeId,
        busId,
        date,
        sortBy = "schedule.plannedStartTime",
        sortOrder = "asc",
      } = req.query;

      const query = {};

      if (status) {
        query.status = status;
      }

      if (routeId) {
        query.routeId = routeId;
      }

      if (busId) {
        query.busId = busId;
      }

      if (date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        query["schedule.plannedStartTime"] = {
          $gte: startOfDay,
          $lte: endOfDay,
        };
      }

      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

      const trips = await Trip.find(query)
        .sort(sortOptions)
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Trip.countDocuments(query);

      res.json({
        success: true,
        data: trips,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Get trip by ID
  static async getTripById(req, res, next) {
    try {
      const { id } = req.params;

      const trip = await Trip.findOne({ tripId: id });

      if (!trip) {
        return res.status(404).json({
          success: false,
          error: {
            message: "Trip not found",
            statusCode: 404,
          },
        });
      }

      res.json({
        success: true,
        data: trip,
      });
    } catch (error) {
      next(error);
    }
  }

  // Create new trip
  static async createTrip(req, res, next) {
    try {
      const tripData = req.body;

      // Generate unique trip ID
      tripData.tripId = `TRP${Date.now()}${Math.random()
        .toString(36)
        .substr(2, 5)
        .toUpperCase()}`;

      // Get route and bus information
      const route = await Route.findOne({ routeId: tripData.routeId });
      const bus = await Bus.findOne({ busId: tripData.busId });

      if (!route) {
        return res.status(400).json({
          success: false,
          error: {
            message: "Route not found",
            statusCode: 400,
          },
        });
      }

      if (!bus) {
        return res.status(400).json({
          success: false,
          error: {
            message: "Bus not found",
            statusCode: 400,
          },
        });
      }

      // Set trip route information
      tripData.route = {
        origin: route.origin,
        destination: route.destination,
        waypoints: route.waypoints,
      };

      // Set passenger capacity from bus
      tripData.passengers.capacity = bus.vehicleInfo.capacity;

      const trip = new Trip(tripData);
      await trip.save();

      // Update bus current trip
      bus.currentTrip = {
        tripId: trip.tripId,
        startTime: trip.schedule.plannedStartTime,
        expectedEndTime: trip.schedule.plannedEndTime,
        progress: 0,
      };
      await bus.save();

      res.status(201).json({
        success: true,
        data: trip,
        message: "Trip created successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Get active trips
  static async getActiveTrips(req, res, next) {
    try {
      const trips = await Trip.find({
        status: { $in: ["boarding", "departed", "in_transit"] },
      });

      res.json({
        success: true,
        data: trips,
        count: trips.length,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get trip statistics
  static async getTripStats(req, res, next) {
    try {
      const stats = await Trip.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      const totalTrips = await Trip.countDocuments();
      const activeTrips = await Trip.countDocuments({
        status: { $in: ["boarding", "departed", "in_transit"] },
      });

      res.json({
        success: true,
        data: {
          total: totalTrips,
          active: activeTrips,
          byStatus: stats,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Update trip
  static async updateTrip(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body || {};

      // Whitelist allowed fields for update
      const allowed = {};
      if (updateData.schedule) {
        allowed["schedule.plannedStartTime"] =
          updateData.schedule.plannedStartTime;
        allowed["schedule.plannedEndTime"] = updateData.schedule.plannedEndTime;
      }
      if (updateData.passengers) {
        if (typeof updateData.passengers.total !== "undefined") {
          allowed["passengers.total"] = updateData.passengers.total;
        }
        if (typeof updateData.passengers.capacity !== "undefined") {
          allowed["passengers.capacity"] = updateData.passengers.capacity;
        }
      }
      if (updateData.status) {
        allowed.status = updateData.status;
      }

      const trip = await Trip.findOneAndUpdate(
        { tripId: id },
        { $set: allowed },
        { new: true, runValidators: true }
      );

      if (!trip) {
        return res.status(404).json({
          success: false,
          error: { message: "Trip not found", statusCode: 404 },
        });
      }

      res.json({
        success: true,
        data: trip,
        message: "Trip updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete trip
  static async deleteTrip(req, res, next) {
    try {
      const { id } = req.params;

      const trip = await Trip.findOneAndDelete({ tripId: id });
      if (!trip) {
        return res.status(404).json({
          success: false,
          error: { message: "Trip not found", statusCode: 404 },
        });
      }

      // Clear bus current trip if it matches
      await Bus.updateMany(
        { "currentTrip.tripId": id },
        { $unset: { currentTrip: 1 } }
      );

      res.json({ success: true, message: "Trip deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  // Get trips by route and date
  static async getTripsByRouteAndDate(req, res, next) {
    try {
      const { routeId, date } = req.params;

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const trips = await Trip.find({
        routeId,
        "schedule.plannedStartTime": { $gte: startOfDay, $lte: endOfDay },
      }).populate("busId", "registrationNumber operator");

      res.json({
        success: true,
        data: trips,
        count: trips.length,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update trip progress
  static async updateTripProgress(req, res, next) {
    try {
      const { id } = req.params;
      const { currentLocation, nextStop, percentage } = req.body;

      const trip = await Trip.findOne({ tripId: id });
      if (!trip)
        return res
          .status(404)
          .json({
            success: false,
            error: { message: "Trip not found", statusCode: 404 },
          });

      // Minimal safe updates if your model lacks helper methods
      if (typeof percentage === "number")
        trip.progress.percentage = Math.max(0, Math.min(100, percentage));
      if (currentLocation?.latitude && currentLocation?.longitude) {
        trip.tracking = trip.tracking || {};
        trip.tracking.currentLocation = currentLocation;
      }
      if (nextStop?.name) trip.progress.nextStop = nextStop.name;

      await trip.save();

      const io = req.app.get("io");
      if (io)
        io.emit("tripProgressUpdate", {
          tripId: trip.tripId,
          progress: trip.progress,
        });

      res.json({
        success: true,
        data: trip,
        message: "Trip progress updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Add incident to trip
  static async addTripIncident(req, res, next) {
    try {
      const { id } = req.params;
      const incident = req.body;

      const trip = await Trip.findOne({ tripId: id });
      if (!trip)
        return res
          .status(404)
          .json({
            success: false,
            error: { message: "Trip not found", statusCode: 404 },
          });

      trip.incidents = trip.incidents || [];
      trip.incidents.push({ ...incident, timestamp: new Date() });

      await trip.save();
      res.json({
        success: true,
        data: trip,
        message: "Incident added successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Complete trip
  static async completeTrip(req, res, next) {
    try {
      const { id } = req.params;
      const trip = await Trip.findOne({ tripId: id });
      if (!trip)
        return res
          .status(404)
          .json({
            success: false,
            error: { message: "Trip not found", statusCode: 404 },
          });

      trip.status = "completed";
      trip.schedule.actualEndTime = new Date();
      trip.progress.percentage = 100;
      await trip.save();

      await Bus.updateMany(
        { "currentTrip.tripId": id },
        { $unset: { currentTrip: 1 } }
      );
      res.json({
        success: true,
        data: trip,
        message: "Trip completed successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TripController;
