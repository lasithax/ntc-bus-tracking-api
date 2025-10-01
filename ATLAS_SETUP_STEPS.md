# MongoDB Atlas Setup - Step by Step Guide

## Step 1: Create Account
1. Go to: https://www.mongodb.com/cloud/atlas
2. Click "Try Free" button
3. Fill in your details:
   - First Name: [Your Name]
   - Last Name: [Your Last Name]
   - Email: [Your Email]
   - Password: [Create a strong password]
4. Click "Create your Atlas account"

## Step 2: Create Your First Cluster
1. Choose "Build a Database"
2. Select "FREE" tier (M0 Sandbox) - This is perfect for your project
3. Choose your preferred cloud provider (AWS is recommended)
4. Select a region closest to you (e.g., Asia Pacific - Singapore)
5. Click "Create Cluster"

## Step 3: Setup Database User
1. In the left sidebar, click "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication method
4. Create credentials:
   - Username: ntc-admin
   - Password: [Create a strong password - save this!]
5. Set privileges to "Read and write to any database"
6. Click "Add User"

## Step 4: Setup Network Access
1. In the left sidebar, click "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

## Step 5: Get Connection String
1. In the left sidebar, click "Database"
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" as driver
5. Copy the connection string
6. Replace <password> with your database user password
7. Replace <dbname> with "ntc-bus-tracking"

## Step 6: Update Your .env File
Replace the MONGODB_URI in your .env file with your Atlas connection string.

## Step 7: Test Your Application
Run: npm run dev

Your connection string should look like:
mongodb+srv://ntc-admin:yourpassword@cluster0.xxxxx.mongodb.net/ntc-bus-tracking?retryWrites=true&w=majority
