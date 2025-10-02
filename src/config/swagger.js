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
    components: {
      schemas: {
        Route: {
          type: 'object',
          required: ['routeName', 'origin', 'destination', 'distance', 'estimatedDuration'],
          properties: {
            routeId: {
              type: 'string',
              description: 'Unique route identifier',
              example: 'RT1735656000000ABC12'
            },
            routeName: {
              type: 'string',
              description: 'Name of the route',
              example: 'Colombo - Kandy Express'
            },
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
            distance: {
              type: 'number',
              description: 'Distance in kilometers',
              example: 115
            },
            estimatedDuration: {
              type: 'number',
              description: 'Estimated duration in minutes',
              example: 180
            },
            waypoints: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Kadawatha' },
                  coordinates: {
                    type: 'object',
                    properties: {
                      latitude: { type: 'number', example: 7.0167 },
                      longitude: { type: 'number', example: 80.0167 }
                    }
                  },
                  order: { type: 'number', example: 1 }
                }
              }
            },
            operator: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'Sri Lanka Transport Board' },
                contact: {
                  type: 'object',
                  properties: {
                    phone: { type: 'string', example: '+94-11-2345678' },
                    email: { type: 'string', example: 'info@sltb.lk' }
                  }
                }
              }
            },
            schedule: {
              type: 'object',
              properties: {
                frequency: { type: 'string', example: 'hourly' },
                operatingDays: {
                  type: 'array',
                  items: { type: 'string' },
                  example: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
                },
                firstTrip: { type: 'string', example: '05:00' },
                lastTrip: { type: 'string', example: '22:00' }
              }
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'maintenance'],
              example: 'active'
            }
          }
        },
        Bus: {
          type: 'object',
          required: ['registrationNumber', 'vehicleInfo', 'operator', 'driver'],
          properties: {
            busId: {
              type: 'string',
              description: 'Unique bus identifier',
              example: 'BUS1735656000000XYZ34'
            },
            registrationNumber: {
              type: 'string',
              description: 'Vehicle registration number',
              example: 'WP-AB-1234'
            },
            vehicleInfo: {
              type: 'object',
              properties: {
                make: { type: 'string', example: 'Tata' },
                model: { type: 'string', example: 'Starbus' },
                year: { type: 'number', example: 2020 },
                capacity: { type: 'number', example: 45 },
                fuelType: { type: 'string', example: 'diesel' },
                engineNumber: { type: 'string', example: 'TATA2020SB001' }
              }
            },
            operator: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'Hill Country Transport' },
                contact: {
                  type: 'object',
                  properties: {
                    phone: { type: 'string', example: '+94-11-5678901' },
                    email: { type: 'string', example: 'info@hct.lk' }
                  }
                }
              }
            },
            driver: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'Sunil Perera' },
                licenseNumber: { type: 'string', example: 'DL123456789' },
                phone: { type: 'string', example: '+94-77-1234567' },
                experience: { type: 'number', example: 8 }
              }
            },
            currentLocation: {
              type: 'object',
              properties: {
                latitude: { type: 'number', example: 6.9271 },
                longitude: { type: 'number', example: 79.8612 },
                address: { type: 'string', example: 'Colombo Fort Bus Stand' },
                timestamp: { type: 'string', format: 'date-time', example: '2025-10-01T12:00:00.000Z' }
              }
            },
            status: {
              type: 'string',
              enum: ['available', 'in_transit', 'maintenance', 'out_of_service'],
              example: 'available'
            }
          }
        },
        Trip: {
          type: 'object',
          required: ['routeId', 'busId', 'driver', 'schedule'],
          properties: {
            tripId: {
              type: 'string',
              description: 'Unique trip identifier',
              example: 'TRP1735656000000DEF56'
            },
            routeId: {
              type: 'string',
              description: 'Associated route ID',
              example: 'RT1735656000000ABC12'
            },
            busId: {
              type: 'string',
              description: 'Associated bus ID',
              example: 'BUS1735656000000XYZ34'
            },
            driver: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'Rajesh Fernando' },
                licenseNumber: { type: 'string', example: 'DL987654321' },
                phone: { type: 'string', example: '+94-77-9876543' }
              }
            },
            schedule: {
              type: 'object',
              properties: {
                plannedStartTime: { type: 'string', format: 'date-time', example: '2025-10-01T08:00:00.000Z' },
                plannedEndTime: { type: 'string', format: 'date-time', example: '2025-10-01T14:00:00.000Z' },
                departureDelay: { type: 'number', example: 0 },
                arrivalDelay: { type: 'number', example: 0 }
              }
            },
            passengers: {
              type: 'object',
              properties: {
                current: { type: 'number', example: 25 },
                capacity: { type: 'number', example: 45 },
                boarding: { type: 'number', example: 0 },
                alighting: { type: 'number', example: 0 }
              }
            },
            status: {
              type: 'string',
              enum: ['scheduled', 'boarding', 'departed', 'in_transit', 'arrived', 'completed', 'cancelled'],
              example: 'scheduled'
            },
            progress: {
              type: 'object',
              properties: {
                percentage: { type: 'number', example: 0 },
                currentLocation: {
                  type: 'object',
                  properties: {
                    latitude: { type: 'number', example: 6.9271 },
                    longitude: { type: 'number', example: 79.8612 }
                  }
                },
                nextStop: { type: 'string', example: 'Kadawatha' },
                estimatedArrival: { type: 'string', format: 'date-time', example: '2025-10-01T08:30:00.000Z' }
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                message: { type: 'string', example: 'Resource not found' },
                statusCode: { type: 'number', example: 404 }
              }
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object' },
            message: { type: 'string', example: 'Operation completed successfully' }
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