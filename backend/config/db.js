const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MONGODB_URI is set
    if (!process.env.MONGODB_URI) {
      console.error('Error: MONGODB_URI is not defined in environment variables');
      console.log('Please create a .env file with MONGODB_URI=your_connection_string');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    
    if (error.message.includes('IP') || error.message.includes('whitelist')) {
      console.error('\n⚠️  IP Whitelist Issue Detected!');
      console.error('To fix this:');
      console.error('1. Go to MongoDB Atlas Dashboard');
      console.error('2. Navigate to Network Access');
      console.error('3. Click "Add IP Address"');
      console.error('4. Add your current IP or use 0.0.0.0/0 (for development only)');
      console.error('5. Wait a few minutes for changes to propagate\n');
    }
    
    // Don't exit the process - let the server continue running
    // The app can still serve API requests, but database operations will fail
    console.log('Server will continue running, but database operations will fail until connection is established.');
  }
};

module.exports = connectDB;