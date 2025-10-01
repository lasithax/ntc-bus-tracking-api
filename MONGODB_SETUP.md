# MongoDB Local Installation Guide

## Windows Installation:

1. Download MongoDB Community Server:
   https://www.mongodb.com/try/download/community

2. Install MongoDB:
   - Run the installer
   - Choose "Complete" installation
   - Install MongoDB as a Windows Service

3. Start MongoDB:
   - Open Command Prompt as Administrator
   - Run: net start MongoDB
   - Or use Services.msc to start MongoDB service

4. Verify MongoDB is running:
   - Open Command Prompt
   - Run: mongo --version
   - Run: mongod --version

## Alternative: Use MongoDB Compass
1. Download MongoDB Compass (GUI)
2. Connect to localhost:27017
3. Create database: ntc-bus-tracking

## Quick Test:
```bash
# Test MongoDB connection
mongo --eval "db.runCommand('ping')"
```

## Environment Setup:
Update .env file:
```
MONGODB_URI=mongodb://localhost:27017/ntc-bus-tracking
```
