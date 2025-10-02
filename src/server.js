const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// Import routes
const routeRoutes = require('./routes/routeRoutes');
const busRoutes = require('./routes/busRoutes');
const tripRoutes = require('./routes/tripRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

// Import services
const SocketService = require('./services/socketService');

// Import Swagger with error handling
let swaggerUi, specs;
try {
  const swagger = require('./config/swagger');
  swaggerUi = swagger.swaggerUi;
  specs = swagger.specs;
  console.log('âœ… Swagger modules loaded successfully');
} catch (error) {
  console.log('âš ï¸ Swagger modules not available:', error.message);
  swaggerUi = null;
  specs = null;
}

class BusTrackingServer {
  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: process.env.CORS_ORIGIN || "*",
        methods: ["GET", "POST"]
      }
    });
    this.port = process.env.PORT || 3000;
    this.mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ntc-bus-tracking';
  }

  async initialize() {
    try {
      await this.connectDatabase();
      this.setupMiddleware();
      this.setupRoutes();
      this.setupErrorHandling();
      this.setupSocketIO();
      this.startServer();
    } catch (error) {
      console.error('Failed to initialize server:', error);
      process.exit(1);
    }
  }

  async connectDatabase() {
    try {
      await mongoose.connect(this.mongoUri);
      console.log('âœ… Connected to MongoDB');
    } catch (error) {
      console.error('âŒ MongoDB connection error:', error);
      throw error;
    }
  }

  setupMiddleware() {
    // Security middleware
    this.app.use(helmet());
    
    // CORS configuration
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || "*",
      credentials: true
    }));

    // Logging middleware
    this.app.use(morgan('combined'));

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
      });
    });
  }

  setupRoutes() {
    // Swagger Documentation
    if (swaggerUi && specs) {
      this.app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs, {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'NTC Bus Tracking API Documentation'
      }));
      console.log('ðŸ“š Swagger documentation available at /api/docs');
    } else {
      // Fallback documentation endpoint
      this.app.get('/api/docs', (req, res) => {
        res.json({
          message: 'API Documentation',
          note: 'Swagger UI not available. Please check the API endpoints below.',
          endpoints: {
            health: 'GET /health',
            routes: {
              getAll: 'GET /api/v1/routes',
              getById: 'GET /api/v1/routes/:id',
              create: 'POST /api/v1/routes',
              update: 'PUT /api/v1/routes/:id',
              delete: 'DELETE /api/v1/routes/:id'
            },
            buses: {
              getAll: 'GET /api/v1/buses',
              getById: 'GET /api/v1/buses/:id',
              create: 'POST /api/v1/buses',
              updateLocation: 'PUT /api/v1/buses/:id/location'
            },
            trips: {
              getAll: 'GET /api/v1/trips',
              getById: 'GET /api/v1/trips/:id',
              create: 'POST /api/v1/trips',
              getActive: 'GET /api/v1/trips/active',
              getStats: 'GET /api/v1/trips/stats'
            }
          }
        });
      });
      console.log('ðŸ“‹ Fallback API documentation available at /api/docs');
    }

    // API routes
    this.app.use('/api/v1/routes', routeRoutes);
    this.app.use('/api/v1/buses', busRoutes);
    this.app.use('/api/v1/trips', tripRoutes);

    // Seeding endpoint
    this.app.post('/api/seed', async (req, res) => {
      try {
        const { exec } = require('child_process');
        exec('npm run seed', (error, stdout, stderr) => {
          if (error) {
            console.error('Seeding error:', error);
            return res.status(500).json({ success: false, error: error.message });
          }
          console.log('Seeding output:', stdout);
          res.json({ success: true, message: 'Database seeded successfully', output: stdout });
        });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // Root endpoint
    this.app.get('/', (req, res) => {
      res.json({
        message: 'NTC Bus Tracking System API',
        version: '1.0.0',
        status: 'operational',
        documentation: '/api/docs',
        endpoints: {
          routes: '/api/v1/routes',
          buses: '/api/v1/buses',
          trips: '/api/v1/trips'
        }
      });
    });
  }

  setupErrorHandling() {
    // 404 handler
    this.app.use(notFound);
    
    // Global error handler
    this.app.use(errorHandler);
  }

  setupSocketIO() {
    // Make io instance available to Express app
    this.app.set('io', this.io);
    
    // Initialize socket service
    const socketService = new SocketService(this.io);
    socketService.initialize();
  }

  startServer() {
    this.server.listen(this.port, () => {
      console.log(`ðŸšŒ NTC Bus Tracking API Server running on port ${this.port}`);
      console.log(`ðŸ“š API Documentation: http://localhost:${this.port}/api/docs`);
      console.log(`ðŸ“¡ WebSocket server initialized`);
      console.log(`ðŸŒ Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      this.server.close(() => {
        console.log('Process terminated');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully');
      this.server.close(() => {
        console.log('Process terminated');
        process.exit(0);
      });
    });
  }
}

// Start the server
const server = new BusTrackingServer();
server.initialize();

module.exports = server;
