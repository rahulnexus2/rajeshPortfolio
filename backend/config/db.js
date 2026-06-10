import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rajesh_portfolio_cms');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection warning: ${error.message}`);
    console.log('Ensure MongoDB is running or specify a valid MONGODB_URI in the .env file.');
  }
};

export default connectDB;
