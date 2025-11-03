// Mongoose model for backups (for logs).
import mongoose from 'mongoose';

const BackupSchema = new mongoose.Schema({
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Backup', BackupSchema);