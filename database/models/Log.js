// Mongoose model for system logs.
import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
  type: { type: String, enum: ['info', 'error', 'warn', 'command'], required: true },
  message: { type: String, required: true },
  userId: { type: Number },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Log', LogSchema);