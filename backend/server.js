const app = require('./src/app');
const connectDB = require('./src/config/db'); // Import the database connection function

// Load environment variables (if using a .env file)
require('dotenv').config(); // Uncomment if you set up dotenv

const port = process.env.PORT || 3001;

// Set MONGO_URI for development if not already set (should be in .env in production)
if (!process.env.MONGO_URI) {
  process.env.MONGO_URI = 'mongodb://localhost:27017/cpms'; 
}

// Connect to the database
connectDB();

const server = app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Stop other server first.`);
    process.exit(1);
  }
});
