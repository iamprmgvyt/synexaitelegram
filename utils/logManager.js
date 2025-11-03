// Full-featured logging system: saves logs to MongoDB and local file.
// Handles backup/restore and timestamp formatting.
import LogModel from '../database/models/Log.js';
import BackupModel from '../database/models/Backup.js';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import timeFormatter from './timeFormatter.js';

const LOG_FILE = path.resolve('./logs/bot.log');
const BACKUP_FILE = path.resolve('./logs/backup.json');

// Ensures logs directory exists
if (!fs.existsSync(path.dirname(LOG_FILE))) fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });

// Internal file logger
function appendToFile(logEntry) {
  const line = `[${timeFormatter(logEntry.timestamp)}] [${logEntry.type.toUpperCase()}] [User:${logEntry.userId ?? 'SYSTEM'}] ${logEntry.message}\n`;
  fs.appendFileSync(LOG_FILE, line, { encoding: 'utf8' });
}

const logManager = {
  // Create a log (MongoDB + file)
  async createLog(type, message, userId = null) {
    const logEntry = {
      type,
      message,
      userId,
      timestamp: new Date()
    };
    try {
      await LogModel.create(logEntry);
    } catch (e) {
      console.error(chalk.red('[logManager] MongoDB log fail:'), e.message);
    }
    appendToFile(logEntry);
  },

  // List logs: latest N (default 10)
  async listLogs(limit = 10) {
    return await LogModel.find({}).sort({ timestamp: -1 }).limit(limit);
  },

  // Clear logs: backup, then delete
  async clearLogs() {
    // Backup logs to JSON
    const logs = await LogModel.find({});
    fs.writeFileSync(BACKUP_FILE, JSON.stringify(logs, null, 2), 'utf8');
    await BackupModel.create({
      data: logs,
      createdAt: new Date()
    });
    await LogModel.deleteMany({});
    fs.writeFileSync(LOG_FILE, '', 'utf8');
  },

  // Restore logs from latest backup JSON file
  async restoreLogs() {
    let logs;
    if (fs.existsSync(BACKUP_FILE)) {
      logs = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf8'));
      await LogModel.deleteMany({});
      await LogModel.insertMany(logs);
    } else {
      // Try Mongo backups
      const backup = await BackupModel.findOne({}).sort({ createdAt: -1 });
      if (backup && backup.data) {
        await LogModel.deleteMany({});
        await LogModel.insertMany(backup.data);
        logs = backup.data;
      } else {
        throw new Error('Không tìm thấy bản sao lưu logs.');
      }
    }
    // Rewrite bot.log file
    fs.writeFileSync(LOG_FILE, logs.map(l =>
      `[${timeFormatter(l.timestamp)}] [${l.type.toUpperCase()}] [User:${l.userId ?? 'SYSTEM'}] ${l.message}`
    ).join('\n') + '\n', 'utf8');
  }
};

export default logManager;