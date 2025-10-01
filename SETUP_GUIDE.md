# NTC Bus Tracking System - Quick Setup Guide

## ðŸš€ Quick Start Options

### Option 1: Use MongoDB Atlas (Cloud - Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (free tier available)
4. Get your connection string
5. Update .env file with your MongoDB Atlas connection string

### Option 2: Use Docker (Local Development)
1. Install Docker Desktop
2. Run: docker-compose up -d mongodb
3. This will start MongoDB locally

### Option 3: Install MongoDB Locally
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Install MongoDB
3. Start MongoDB service

## ðŸ”§ Environment Setup

### For Local MongoDB:
```bash
# Update .env file
MONGODB_URI=mongodb://localhost:27017/ntc-bus-tracking
```

### For MongoDB Atlas:
```bash
# Update .env file with your Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ntc-bus-tracking
```

## ðŸš€ Start the Application

1. Install dependencies (already done):
   ```bash
   npm install
   ```

2. Start MongoDB (choose one option above)

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Seed the database:
   ```bash
   npm run seed
   ```

## ðŸ§ª Test the API

- Health check: http://localhost:3000/health
- API routes: http://localhost:3000/api/v1/routes
- API buses: http://localhost:3000/api/v1/buses
- API trips: http://localhost:3000/api/v1/trips

## ðŸ“Š Database Seeding

The seed script will create:
- 5 inter-provincial routes
- 25 buses with realistic data
- 7 days of scheduled trips
- Comprehensive driver information

## ðŸ” Troubleshooting

If you get MongoDB connection errors:
1. Make sure MongoDB is running
2. Check your connection string in .env
3. Verify MongoDB is accessible on port 27017
4. For Docker: docker ps to check if container is running

## ðŸŽ¯ Next Steps

1. Set up MongoDB (choose one option above)
2. Start the application
3. Test the API endpoints
4. Deploy to cloud platform
5. Create GitHub repository
