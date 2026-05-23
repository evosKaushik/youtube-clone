import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/youtube-clone?authSource=admin";

    if (!mongoURI) {
      throw new Error("MONGODB_URI is missing in .env");
    }

    if (typeof mongoURI === "string") {
      await mongoose.connect(mongoURI);
      console.log("Connected to MongoDB");
    }
    throw new Error("MONGODB_URI should be a string");


  } catch (error) {
    console.error("Error connecting to MongoDB:", error);

    process.exit(1);
  }
};

export default connectDB;