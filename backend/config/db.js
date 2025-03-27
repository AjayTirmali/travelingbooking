const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    console.error("MongoDB URI is not defined in environment variables");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Failed", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
