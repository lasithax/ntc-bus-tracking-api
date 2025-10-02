# NTC Bus Tracking System API

A comprehensive Real-Time Bus Tracking System for the National Transport Commission of Sri Lanka (NTC) to monitor inter-provincial buses across Sri Lanka.

## Project Overview

This RESTful API provides live GPS-based location data for long-distance buses operating between provinces, enabling real-time tracking and status updates for NTC officials, bus operators, and commuters.

## Architecture

- **Backend**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.io for live updates
- **Validation**: Joi for request validation
- **Security**: Helmet for security headers, CORS enabled

## Features

- Real-time bus location tracking
- Route management and scheduling
- Bus status monitoring
- Historical location data
- WebSocket support for live updates
- Comprehensive API documentation

## API Endpoints

### Routes
- `GET /api/v1/routes` - Get all bus routes
- `GET /api/v1/routes/:id` - Get specific route details
- `POST /api/v1/routes` - Create new route
- `PUT /api/v1/routes/:id` - Update route
- `DELETE /api/v1/routes/:id` - Delete route

### Buses
- `GET /api/v1/buses` - Get all buses with current status
- `GET /api/v1/buses/:id` - Get specific bus details
- `POST /api/v1/buses/:id/location` - Update bus location
- `GET /api/v1/buses/:id/history` - Get bus location history

### Trips
- `GET /api/v1/trips` - Get all scheduled trips
- `GET /api/v1/trips/:id` - Get specific trip details
- `POST /api/v1/trips` - Create new trip
- `PUT /api/v1/trips/:id` - Update trip

## Installation

1. Clone the repository:
```bash
git clone https://github.com/lasithax/ntc-bus-tracking-api.git
cd ntc-bus-tracking-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

5. Seed the database with sample data:
```bash
npm run seed
```

## Deployment

The API is deployed on [Deployment Platform] and accessible at:
- **API Base URL**: [API URL]
- **WebSocket URL**: [WebSocket URL]

## Simulation Data

The system includes simulation data for:
- 5 inter-provincial routes
- 25 buses with scheduled trips
- 1 week of historical data
- Real-time location updates

## Development

### Project Structure
```
src/
controllers/     # Route controllers
models/         # Database models
routes/         # API routes
middleware/     # Custom middleware
services/       # Business logic
utils/          # Utility functions
scripts/        # Database seeding scripts
server.js       # Main server file
```

### Testing
```bash
npm test
```

## API Documentation

Full API documentation is available at: 

## Contributing

This project is developed for academic purposes as part of the coursework requirements.

## License

MIT License - see LICENSE file for details.

## Instructor Access

Instructor has been added as a collaborator to this repository for evaluation purposes.

## Links

- **Deployed API**: [https://ntc-bus-tracking-api-production.up.railway.app/]
- **GitHub Repository**: [https://github.com/lasithax/ntc-bus-tracking-api.git]
- **API Documentation**: [Documentation URL]
