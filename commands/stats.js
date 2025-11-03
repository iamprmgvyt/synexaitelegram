// /stats — Show bot stats
import UserModel from '../database/models/User.js';
import LogModel from '../database/models/Log.js';
import logManager from '../utils/logManager.js';

export default async function(ctx) {
  try {
    const usersCount = await UserModel.countDocuments({});
    const messagesCountArr = await UserModel.aggregate([
      { $unwind: '$messages' },
      { $count: 'total_messages' }
    ]);
    const logsCount = await LogModel.countDocuments({});

    const msg = `📊 Thống kê:\n` +
      `• Người dùng: ${usersCount}\n` +
      `• Tin nhắn đã lưu: ${messagesCountArr[0]?.total_messages ?? 0}\n` +
      `• Tổng số logs: ${logsCount}`;

    await ctx.reply(msg);
    await logManager.createLog('info', 'User checked bot stats', ctx.from.id);
  } catch (err) {
    await ctx.reply('Không thể lấy thống kê.');
    await logManager.createLog('error', `Stats command failed: ${err.message}`, ctx.from.id);
  }
}