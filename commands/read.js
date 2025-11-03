// /read - Retrieve all saved messages for current user
import UserModel from '../database/models/User.js';
import logManager from '../utils/logManager.js';
import timeFormatter from '../utils/timeFormatter.js';

export default async function(ctx) {
  try {
    const userId = ctx.from.id;
    const user = await UserModel.findOne({ userId });
    if (!user || !user.messages.length) {
      await ctx.reply('Bạn chưa lưu tin nhắn nào.');
    } else {
      const msgs = user.messages.map(
        (m, idx) => `${idx + 1}. [${timeFormatter(m.timestamp)}] ${m.text}`
      ).join('\n');
      await ctx.reply(`🗄️ Tin nhắn đã lưu:\n${msgs}`);
    }
    await logManager.createLog('info', 'User read saved messages', userId);
  } catch (err) {
    await ctx.reply('Không thể đọc tin nhắn đã lưu.');
    await logManager.createLog('error', `Read messages failed: ${err.message}`, ctx.from.id);
  }
}