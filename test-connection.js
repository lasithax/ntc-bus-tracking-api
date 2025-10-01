const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('ðŸ”Œ Testing MongoDB Atlas connection...');
    console.log('Connection string:', process.env.MONGODB_URI?.replace(/\/\/.*@/, '//***:***@'));
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('âœ… Successfully connected to MongoDB Atlas!');
    console.log('ðŸŽ‰ Your database is ready for the NTC Bus Tracking System');
    
    // Test basic operations
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('ðŸ“Š Available collections:', collections.map(c => c.name));
    
    await mongoose.connection.close();
    console.log('ðŸ”Œ Connection closed successfully');
    
  } catch (error) {
    console.error('âŒ Connection failed:', error.message);
    console.log('\\nðŸ”§ Troubleshooting:');
    console.log('1. Check your .env file has the correct MONGODB_URI');
    console.log('2. Verify your Atlas cluster is running');
    console.log('3. Check your database user credentials');
    console.log('4. Ensure network access allows your IP (0.0.0.0/0)');
    process.exit(1);
  }
}

testConnection();
