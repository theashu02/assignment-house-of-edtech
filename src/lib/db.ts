import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log("MongoDB Connected successfuly");
};

export default connectDB;
