// Mongoose model for Telegram users and their messages.
import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  timestamp: { type: Date, required: true }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  userId: { type: Number, required: true, unique: true },
  username: { type: String },
  messages: { type: [MessageSchema], default: [] },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);