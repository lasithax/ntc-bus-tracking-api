# NTC Bus Tracking System API

## Student ID: [Your Student ID]

A comprehensive Real-Time Bus Tracking System for the National Transport Commission of Sri Lanka (NTC) to monitor inter-provincial buses across Sri Lanka.

## ðŸšŒ Project Overview

This RESTful API provides live GPS-based location data for long-distance buses operating between provinces, enabling real-time tracking and status updates for NTC officials, bus operators, and commuters.

## ðŸ—ï¸ Architecture

- **Backend**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.io for live updates
- **Validation**: Joi for request validation
- **Security**: Helmet for security headers, CORS enabled

## ðŸš€ Features

- Real-time bus location tracking
- Route management and scheduling
- Bus status monitoring
- Historical location data
- WebSocket support for live updates
- Comprehensive API documentation

## ðŸ“‹ API Endpoints

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

## ðŸ› ï¸ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ntc-bus-tracking-api.git
cd ntc-bus-tracking-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development server:
```bash
npm run dev
```

5. Seed the database with sample data:
```bash
npm run seed
```

## ðŸš€ Deployment

The API is deployed on [Your Deployment Platform] and accessible at:
- **API Base URL**: [Your API URL]
- **WebSocket URL**: [Your WebSocket URL]

## ðŸ“Š Simulation Data

The system includes simulation data for:
- 5 inter-provincial routes
- 25 buses with scheduled trips
- 1 week of historical data
- Real-time location updates

## ðŸ”§ Development

### Project Structure
```
src/
â”œâ”€â”€ controllers/     # Route controllers
â”œâ”€â”€ models/         # Database models
â”œâ”€â”€ routes/         # API routes
â”œâ”€â”€ middleware/     # Custom middleware
â”œâ”€â”€ services/       # Business logic
â”œâ”€â”€ utils/          # Utility functions
â”œâ”€â”€ scripts/        # Database seeding scripts
â””â”€â”€ server.js       # Main server file
```

### Testing
```bash
npm test
```

## ðŸ“ API Documentation

Full API documentation is available at: [Your API Documentation URL]

## ðŸ¤ Contributing

This project is developed for academic purposes as part of the coursework requirements.

## ðŸ“„ License

MIT License - see LICENSE file for details.

## ðŸ‘¨â€ðŸ« Instructor Access

Instructor has been added as a collaborator to this repository for evaluation purposes.

## ðŸ”— Links

- **Deployed API**: [Your API URL]
- **GitHub Repository**: [Your GitHub URL]
- **API Documentation**: [Your Documentation URL]
- **AI Tools Used**: [List of AI tools used in development]
