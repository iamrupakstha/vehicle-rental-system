import mongoose from "mongoose";
import dotenv from 'dotenv';

const connectDB = async () => {
  try {
    const MongoURL = process.env.Mongo_URL;
    const conn = await mongoose.connect(MongoURL);
    console.log(`MongoDB Connnected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
export default connectDB;