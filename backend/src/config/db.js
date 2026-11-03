import mongoose from 'mongoose';

/**
 * Connect to MongoDB Atlas or local MongoDB instance
 */
const connectDB = async () => {
  try {
    const connUri = process.env.MONGO_URI;

    if (!connUri) {
      console.warn('⚠️  WARNING: MONGO_URI is not defined in your .env file.');
      console.warn('👉 Please create a .env file and set MONGO_URI with your MongoDB Atlas connection string.');
      console.warn('   Example: MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/intro_backend?retryWrites=true&w=majority\n');
      return;
    }

    const conn = await mongoose.connect(connUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Do not exit process completely in development so the HTTP server can still show informative status
  }
};

export default connectDB;
