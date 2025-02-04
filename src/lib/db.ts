import mongoose, { ConnectOptions } from "mongoose";

const connectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState >= 1) return;

  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI environment variable is not defined");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    console.log("MongoDB Connected");
  } catch (error: unknown) {
    console.error(
      "MongoDB Connection Failed:",
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  }
};

export default connectDB;