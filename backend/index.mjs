import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import typeDefs from './graphql/typeDefs.mjs';
import resolvers from './graphql/resolvers.mjs';
import Booking from './models/Booking.mjs';

dotenv.config(); // Load environment variables from .env file

const mongoURI = process.env.MONGO_URI; // Load MONGO_URI from .env
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected Successfully"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// Initialize Express
const app = express();
app.use(cors({
  origin: "https://travelingbooking-hjkb62a3p-ajay-tirmalis-projects.vercel.app",
  credentials: true,
}));
app.use(express.json());

// Function to clean up expired bookings
const cleanupExpiredBookings = async () => {
  try {
    // Get current date at the start of the day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Find and delete bookings with dates less than today
    const result = await Booking.deleteMany({ date: { $lt: today } });
    
    console.log(`🧹 Cleanup: Removed ${result.deletedCount} expired bookings`);
  } catch (error) {
    console.error("❌ Error cleaning up expired bookings:", error.message);
  }
};

// Schedule cleanup to run once a day at midnight
const scheduleCleanup = () => {
  // Run cleanup immediately on server start
  cleanupExpiredBookings();
  
  // Calculate time until midnight
  const now = new Date();
  const night = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1, // tomorrow
    0, 0, 0 // midnight
  );
  const msUntilMidnight = night.getTime() - now.getTime();
  
  // Schedule first cleanup at midnight
  setTimeout(() => {
    cleanupExpiredBookings();
    
    // Then schedule it to run every 24 hours
    setInterval(cleanupExpiredBookings, 24 * 60 * 60 * 1000);
  }, msUntilMidnight);
  
  console.log(`🕒 Scheduled cleanup: First run in ${Math.round(msUntilMidnight / 1000 / 60)} minutes`);
};

// Setup Apollo Server
const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}${server.graphqlPath}`);
    
    // Start the cleanup schedule
    scheduleCleanup();
  });
};

startServer();
