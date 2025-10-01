# MongoDB Atlas Setup Guide for Deployment

## Step 1: Create MongoDB Atlas Account
1. Go to: https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Create account with email/password

## Step 2: Create Cluster
1. Choose "Build a Database"
2. Select "FREE" tier (M0 Sandbox)
3. Choose AWS as provider
4. Select region closest to you
5. Click "Create Cluster"

## Step 3: Setup Database Access
1. Go to "Database Access" in left menu
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create username/password (save these!)
5. Set privileges to "Read and write to any database"

## Step 4: Setup Network Access
1. Go to "Network Access" in left menu
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

## Step 5: Get Connection String
1. Go to "Database" in left menu
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace <password> with your database user password

## Step 6: Update .env File
Replace the MONGODB_URI in your .env file with your Atlas connection string:

MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ntc-bus-tracking?retryWrites=true&w=majority

## Step 7: Test Connection
Run your application:
npm run dev

## Deployment Benefits:
- Works with any cloud platform
- No local MongoDB installation needed
- Automatic backups and monitoring
- Easy to scale
- Free tier available
- Production-ready security
