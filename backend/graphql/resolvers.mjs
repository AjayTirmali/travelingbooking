import Booking from "../models/Booking.mjs";
import mongoose from "mongoose";

const resolvers = {
  Query: {
    getBookings: async () => {
      try {
        const bookings = await Booking.find().sort({ date: 1 });
        console.log("Retrieved bookings:", bookings);
        return bookings;
      } catch (error) {
        console.error("Error fetching bookings:", error.message);
        throw new Error("Error fetching bookings: " + error.message);
      }
    },
    getActiveBookings: async () => {
      try {
        // Get current date at the start of the day
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        console.log("Filtering bookings from date:", today);
        
        // Find bookings with dates greater than or equal to today
        const activeBookings = await Booking.find({ 
          date: { $gte: today } 
        }).sort({ date: 1 });
        
        console.log("Retrieved active bookings:", activeBookings);
        
        // Double-check dates in JavaScript as well
        const verifiedBookings = activeBookings.filter(booking => {
          const bookingDate = new Date(booking.date);
          return bookingDate >= today;
        });
        
        console.log("Verified active bookings:", verifiedBookings);
        
        return verifiedBookings;
      } catch (error) {
        console.error("Error fetching active bookings:", error.message);
        throw new Error("Error fetching active bookings: " + error.message);
      }
    },
  },
  Mutation: {
    addBooking: async (_, { name, email, destination, date }) => {
      try {
        console.log("Received date string:", date);
        
        // Handle different date formats
        let parsedDate;
        
        // Check if date is in YYYY-MM-DD format
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          // Split the date string and create a new Date object
          const [year, month, day] = date.split('-').map(num => parseInt(num, 10));
          parsedDate = new Date(year, month - 1, day); // month is 0-indexed in JavaScript
          console.log(`Parsed from YYYY-MM-DD: ${year}-${month}-${day} to:`, parsedDate);
        } else {
          // Try standard parsing
          parsedDate = new Date(date);
          console.log("Parsed using standard Date constructor:", parsedDate);
        }
        
        // Check if date is valid
        if (isNaN(parsedDate.getTime())) {
          console.error("Invalid date after parsing:", parsedDate);
          throw new Error("Invalid date format. Please use YYYY-MM-DD format.");
        }
        
        // Ensure the date is not in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (parsedDate < today) {
          throw new Error("Travel date cannot be in the past.");
        }
        
        console.log("Final parsed date to be saved:", parsedDate);
        
        const booking = new Booking({ 
          name, 
          email, 
          destination, 
          date: parsedDate 
        });
        
        const savedBooking = await booking.save();
        console.log("New booking saved:", savedBooking);
        return savedBooking;
      } catch (error) {
        console.error("Error adding booking:", error.message);
        throw new Error("Error adding booking: " + error.message);
      }
    },
    deleteBooking: async (_, { id }) => {
      try {
        // Check if ID is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return {
            success: false,
            message: "Invalid booking ID format"
          };
        }
        
        // Find and delete the booking
        const deletedBooking = await Booking.findByIdAndDelete(id);
        
        if (!deletedBooking) {
          return {
            success: false,
            message: "Booking not found"
          };
        }
        
        console.log("Deleted booking:", deletedBooking);
        return {
          success: true,
          message: "Booking deleted successfully"
        };
      } catch (error) {
        console.error("Error deleting booking:", error.message);
        return {
          success: false,
          message: "Error deleting booking: " + error.message
        };
      }
    },
  },
};

export default resolvers;