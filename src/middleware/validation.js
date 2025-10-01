const Joi = require('joi');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation Error',
          details: error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
          }))
        }
      });
    }
    next();
  };
};

// Validation schemas
const routeValidationSchema = Joi.object({
  routeName: Joi.string().required().trim().min(2).max(100),
  origin: Joi.object({
    city: Joi.string().required().trim().min(2).max(50),
    province: Joi.string().required().trim().min(2).max(50),
    coordinates: Joi.object({
      latitude: Joi.number().required().min(-90).max(90),
      longitude: Joi.number().required().min(-180).max(180)
    }).required()
  }).required(),
  destination: Joi.object({
    city: Joi.string().required().trim().min(2).max(50),
    province: Joi.string().required().trim().min(2).max(50),
    coordinates: Joi.object({
      latitude: Joi.number().required().min(-90).max(90),
      longitude: Joi.number().required().min(-180).max(180)
    }).required()
  }).required(),
  distance: Joi.number().required().min(0),
  estimatedDuration: Joi.number().required().min(0),
  waypoints: Joi.array().items(
    Joi.object({
      name: Joi.string().required().trim().min(2).max(100),
      coordinates: Joi.object({
        latitude: Joi.number().required().min(-90).max(90),
        longitude: Joi.number().required().min(-180).max(180)
      }).required(),
      order: Joi.number().required().min(0)
    })
  ).optional(),
  operator: Joi.object({
    name: Joi.string().required().trim().min(2).max(100),
    contact: Joi.object({
      phone: Joi.string().optional().trim().pattern(/^[\+]?[0-9\s\-\(\)]+$/),
      email: Joi.string().optional().email()
    }).optional()
  }).required(),
  schedule: Joi.object({
    frequency: Joi.string().valid('hourly', 'daily', 'weekly').default('daily'),
    operatingDays: Joi.array().items(
      Joi.string().valid('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')
    ).min(1),
    firstTrip: Joi.string().required().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    lastTrip: Joi.string().required().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  }).required()
});

const busValidationSchema = Joi.object({
  registrationNumber: Joi.string().required().trim().uppercase().min(3).max(20),
  routeId: Joi.string().required().trim(),
  operator: Joi.object({
    name: Joi.string().required().trim().min(2).max(100),
    contact: Joi.object({
      phone: Joi.string().optional().trim().pattern(/^[\+]?[0-9\s\-\(\)]+$/),
      email: Joi.string().optional().email()
    }).optional()
  }).required(),
  vehicleInfo: Joi.object({
    make: Joi.string().required().trim().min(2).max(50),
    model: Joi.string().required().trim().min(2).max(50),
    year: Joi.number().required().min(1990).max(new Date().getFullYear() + 1),
    capacity: Joi.number().required().min(1).max(100),
    features: Joi.array().items(
      Joi.string().valid('ac', 'wifi', 'usb_charging', 'gps_tracking', 'cctv', 'wheelchair_accessible')
    ).optional()
  }).required(),
  driver: Joi.object({
    name: Joi.string().required().trim().min(2).max(100),
    licenseNumber: Joi.string().required().trim().min(5).max(20),
    contact: Joi.object({
      phone: Joi.string().optional().trim().pattern(/^[\+]?[0-9\s\-\(\)]+$/)
    }).optional(),
    experience: Joi.number().optional().min(0)
  }).required()
});

const locationUpdateSchema = Joi.object({
  latitude: Joi.number().required().min(-90).max(90),
  longitude: Joi.number().required().min(-180).max(180),
  speed: Joi.number().optional().min(0).max(200),
  direction: Joi.number().optional().min(0).max(360),
  accuracy: Joi.number().optional().min(0).max(100)
});

const tripValidationSchema = Joi.object({
  routeId: Joi.string().required().trim(),
  busId: Joi.string().required().trim(),
  driverId: Joi.string().required().trim(),
  schedule: Joi.object({
    plannedStartTime: Joi.date().required(),
    plannedEndTime: Joi.date().required().greater(Joi.ref('plannedStartTime'))
  }).required(),
  passengers: Joi.object({
    total: Joi.number().optional().min(0).default(0),
    capacity: Joi.number().required().min(1).max(100)
  }).optional()
});

module.exports = {
  validateRequest,
  routeValidationSchema,
  busValidationSchema,
  locationUpdateSchema,
  tripValidationSchema
};
