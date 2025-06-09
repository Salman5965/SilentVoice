import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Remove deprecated options
      // useNewUrlParser and useUnifiedTopology are now default
    });

    console.log(`📊 MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed through app termination");
      process.exit(0);
    });
  } catch (error) {
    console.error("🔴 Database connection error:", error.message);
    console.warn(
      "⚠️  Server will continue running without database connection"
    );
    console.warn(
      "💡 To fix this, start MongoDB or update MONGODB_URI in .env file"
    );
    console.warn("📖 See QUICK_START.md for setup instructions");

    // Don't exit the process - let the app run without DB for development
    // In production, you might want to exit or use a different strategy
    if (process.env.NODE_ENV === "production") {
      console.error("💥 Database connection required in production mode");
      process.exit(1);
    }
  }
};

export default connectDB;
