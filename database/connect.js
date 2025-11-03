// MongoDB connection handler with async retries support.
// Ensures auto-reconnect for production environments.
import mongoose from 'mongoose';
import chalk from 'chalk';

const { MONGO_URI } = process.env;

export const connectDB = async (retries = 5) => {
  let connected = false;
  for (let attempt = 1; attempt <= retries && !connected; attempt++) {
    try {
      await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      connected = true;
      console.log(chalk.green(`[MongoDB] Connected: ${MONGO_URI}`));
    } catch (err) {
      console.error(chalk.red(`[MongoDB] Connection attempt ${attempt} failed:`), err.message);
      if (attempt < retries) {
        await new Promise((res) => setTimeout(res, 2000));
      } else {
        throw new Error('Failed to connect to MongoDB after maximum retries.');
      }
    }
  }
};