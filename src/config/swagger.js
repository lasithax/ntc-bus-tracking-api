const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NTC Bus Tracking API',
      version: '1.0.0',
      description: 'Real-Time Bus Tracking System for National Transport Commission of Sri Lanka',
      contact: {
        name: 'Lasitha',
        email: 'lasitha@example.com'
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
    components: {
      schemas: {
        Route: {
          type: 'object',
          properties: {
            routeId: { type: 'string', example: 'RT1735656000000ABC12' },
            routeName: { type: 'string', example: 'Colombo - Kandy Express' },
            origin: {
              type: 'object',
              properties: {
                city: { type: 'string', example: 'Colombo' },
                province: { type: 'string', example: 'Western' },
                coordinates: {
                  type: 'object',
                  properties: {
                    latitude: { type: 'number', example: 6.9271 },
                    longitude: { type: 'number', example: 79.8612 }
                  }
                }
              }
            },
            destination: {
              type: 'object',
              properties: {
                city: { type: 'string', example: 'Kandy' },
                province: { type: 'string', example: 'Central' },
                coordinates: {
                  type: 'object',
                  properties: {
                    latitude: { type: 'number', example: 7.2906 },
                    longitude: { type: 'number', example: 80.6337 }
                  }
                }
              }
            },
            distance: { type: 'number', example: 115 },
            estimatedDuration: { type: 'number', example: 180 }
          }
        },
        Bus: {
          type: 'object',
          properties: {
            busId: { type: 'string', example: 'BUS1735656000000XYZ34' },
            registrationNumber: { type: 'string', example: 'WP-AB-1234' },
            vehicleInfo: {
              type: 'object',
              properties: {
                make: { type: 'string', example: 'Tata' },
                model: { type: 'string', example: 'Starbus' },
                year: { type: 'number', example: 2020 },
                capacity: { type: 'number', example: 45 }
              }
            },
            status: { type: 'string', example: 'available' }
          }
        },
        Trip: {
          type: 'object',
          properties: {
            tripId: { type: 'string', example: 'TRP1735656000000DEF56' },
            routeId: { type: 'string', example: 'RT1735656000000ABC12' },
            busId: { type: 'string', example: 'BUS1735656000000XYZ34' },
            status: { type: 'string', example: 'scheduled' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const specs = swaggerJSDoc(options);

module.exports = {
  swaggerUi,
  specs
};
