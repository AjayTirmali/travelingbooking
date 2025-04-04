import { connectToDB } from '../lib/db.js';
import Booking from '../models/Booking.mjs';

export default async function handler(req, res) {
  await connectToDB();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const result = await Booking.deleteMany({ date: { $lt: today } });
    console.log(`🧹 Cleanup: Removed ${result.deletedCount} expired bookings`);
    res.status(200).json({ 
      success: true,
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error("❌ Error cleaning up expired bookings:", error.message);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
} 