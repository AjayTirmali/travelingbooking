import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
  },
  destination: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    get: function(date) {
      return date ? date.toISOString().split('T')[0] : null;
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  toJSON: { getters: true, virtuals: true },
  toObject: { getters: true, virtuals: true }
});

// Add a virtual property for formatted date
BookingSchema.virtual('formattedDate').get(function() {
  if (!this.date) return null;
  
  const date = new Date(this.date);
  if (isNaN(date.getTime())) return null;
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

export default mongoose.model("Booking", BookingSchema);
