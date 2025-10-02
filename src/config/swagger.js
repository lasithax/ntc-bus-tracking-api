const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NTC Bus Tracking API',
      version: '1.0.0',
      description: 'Real-Time Bus Tracking System for National Transport Commission of Sri Lanka (NTC). Provides live GPS-based location data for inter-provincial buses via a RESTful API.',
      contact: {
        name: 'Lasitha',
        email: 'lasitha@example.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'https://ntc-bus-tracking-api-production.up.railway.app',
        description: 'Production server'
      },
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    tags: [
      {
        name: 'Health',
        description: 'API Health Check and Status'
      },
      {
        name: 'Routes',
        description: 'Bus Route Management - Create, read, update, and delete bus routes'
      },
      {
        name: 'Buses',
        description: 'Bus Management and Real-time Tracking - Manage bus fleet and track locations'
      },
      {
        name: 'Trips',
        description: 'Trip Scheduling and Real-time Status - Schedule trips and track progress'
      }
    ],
    components: {
      schemas: {
        Coordinates: {
          type: 'object',
          required: ['latitude', 'longitude'],
          properties: {
            latitude: { 
              type: 'number', 
              format: 'float', 
              minimum: -90, 
              maximum: 90,
              example: 6.9271,
              description: 'Latitude coordinate'
            },
            longitude: { 
              type: 'number', 
              format: 'float', 
              minimum: -180, 
              maximum: 180,
              example: 79.8612,
              description: 'Longitude coordinate'
            }
          }
        },
        Location: {
          type: 'object',
          required: ['city', 'province', 'coordinates'],
          properties: {
            city: { 
              type: 'string', 
              example: 'Colombo',
              description: 'City name'
            },
            province: { 
              type: 'string', 
              example: 'Western',
              description: 'Province name'
            },
            coordinates: { 
              $ref: '#/components/schemas/Coordinates',
              description: 'Geographic coordinates'
            }
          }
        },
        Waypoint: {
          type: 'object',
          required: ['name', 'coordinates', 'order'],
          properties: {
            name: { 
              type: 'string', 
              example: 'Kadawatha',
              description: 'Waypoint name'
            },
            coordinates: { 
              $ref: '#/components/schemas/Coordinates',
              description: 'Waypoint coordinates'
            },
            order: { 
              type: 'integer', 
              minimum: 1,
              example: 1,
              description: 'Order of waypoint in route'
            }
          }
        },
        Contact: {
          type: 'object',
          properties: {
            phone: { 
              type: 'string', 
              pattern: '^\\+94-\\d{2}-\\d{7}$',
              example: '+94-11-2345678',
              description: 'Phone number in Sri Lankan format'
            },
            email: { 
              type: 'string', 
              format: 'email', 
              example: 'info@sltb.lk',
              description: 'Email address'
            }
          }
        },
        Operator: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { 
              type: 'string', 
              example: 'Sri Lanka Transport Board',
              description: 'Transport operator name'
            },
            contact: { 
              $ref: '#/components/schemas/Contact',
              description: 'Operator contact information'
            }
          }
        },
        Schedule: {
          type: 'object',
          required: ['frequency', 'operatingDays', 'firstTrip', 'lastTrip'],
          properties: {
            frequency: { 
              type: 'string', 
              enum: ['daily', 'hourly', 'weekly'], 
              example: 'daily',
              description: 'Service frequency'
            },
            operatingDays: { 
              type: 'array', 
              items: { 
                type: 'string', 
                enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] 
              }, 
              example: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
              description: 'Days of operation'
            },
            firstTrip: { 
              type: 'string', 
              pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
              example: '05:00',
              description: 'First trip time (HH:MM)'
            },
            lastTrip: { 
              type: 'string', 
              pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
              example: '22:00',
              description: 'Last trip time (HH:MM)'
            }
          }
        },
        VehicleInfo: {
          type: 'object',
          required: ['make', 'model', 'year', 'capacity'],
          properties: {
            make: { 
              type: 'string', 
              example: 'Tata',
              description: 'Vehicle manufacturer'
            },
            model: { 
              type: 'string', 
              example: 'Starbus',
              description: 'Vehicle model'
            },
            year: { 
              type: 'integer', 
              minimum: 1990,
              maximum: 2030,
              example: 2020,
              description: 'Manufacturing year'
            },
            capacity: { 
              type: 'integer', 
              minimum: 10,
              maximum: 100,
              example: 45,
              description: 'Passenger capacity'
            },
            fuelType: { 
              type: 'string', 
              enum: ['diesel', 'petrol', 'electric', 'hybrid'], 
              example: 'diesel',
              description: 'Fuel type'
            },
            engineNumber: { 
              type: 'string', 
              example: 'TATA2020SB001',
              description: 'Engine number'
            }
          }
        },
        Driver: {
          type: 'object',
          required: ['name', 'licenseNumber', 'phone'],
          properties: {
            name: { 
              type: 'string', 
              example: 'Kamal Perera',
              description: 'Driver full name'
            },
            licenseNumber: { 
              type: 'string', 
              pattern: '^DL\\d{9}$',
              example: 'DL123456789',
              description: 'Driving license number'
            },
            phone: { 
              type: 'string', 
              pattern: '^\\+94-\\d{2}-\\d{7}$',
              example: '+94-77-1234567',
              description: 'Driver phone number'
            },
            experience: { 
              type: 'integer', 
              minimum: 0,
              maximum: 50,
              example: 5,
              description: 'Years of driving experience'
            }
          }
        },
        BusLocation: {
          type: 'object',
          required: ['latitude', 'longitude', 'timestamp'],
          properties: {
            latitude: { 
              type: 'number', 
              format: 'float', 
              minimum: -90, 
              maximum: 90,
              example: 6.9271,
              description: 'Current latitude'
            },
            longitude: { 
              type: 'number', 
              format: 'float', 
              minimum: -180, 
              maximum: 180,
              example: 79.8612,
              description: 'Current longitude'
            },
            address: { 
              type: 'string', 
              example: 'Colombo Fort Bus Stand',
              description: 'Human-readable address'
            },
            timestamp: { 
              type: 'string', 
              format: 'date-time', 
              example: '2025-10-01T12:00:00.000Z',
              description: 'Location update timestamp'
            },
            speed: { 
              type: 'number', 
              format: 'float', 
              minimum: 0,
              maximum: 200,
              example: 45.5,
              description: 'Speed in km/h'
            },
            heading: { 
              type: 'integer', 
              minimum: 0,
              maximum: 359,
              example: 180,
              description: 'Direction in degrees (0-359)'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { 
              type: 'boolean', 
              example: false 
            },
            error: {
              type: 'object',
              properties: {
                message: { 
                  type: 'string', 
                  example: 'Resource not found' 
                },
                statusCode: { 
                  type: 'integer', 
                  example: 404 
                }
              }
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2025-10-01T12:00:00.000Z'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: { 
              type: 'boolean', 
              example: true 
            },
            message: { 
              type: 'string', 
              example: 'Operation successful' 
            },
            data: { 
              type: 'object',
              description: 'Response data'
            }
          }
        },
        Pagination: {
          type: 'object',
          properties: {
            current: {
              type: 'integer',
              example: 1,
              description: 'Current page number'
            },
            pages: {
              type: 'integer',
              example: 10,
              description: 'Total number of pages'
            },
            total: {
              type: 'integer',
              example: 100,
              description: 'Total number of items'
            },
            limit: {
              type: 'integer',
              example: 10,
              description: 'Items per page'
            }
          }
        }
      },
      responses: {
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        BadRequest: {
          description: 'Bad request - Invalid input data',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        ServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js', './src/docs/*.js']
};

const specs = swaggerJSDoc(options);

module.exports = {
  swaggerUi,
  specs
};
