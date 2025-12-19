import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser:true,useUnifiedTopology:true});
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    let isConnected = true;
    return isConnected;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    let isConnected = false;
    return isConnected;
  }
};


export default connectDB;
 