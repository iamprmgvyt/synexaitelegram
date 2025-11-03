// /save - Save user's latest message
import UserModel from '../database/models/User.js';
import logManager from '../utils/logManager.js';
import timeFormatter from '../utils/timeFormatter.js';

export default async function(ctx) {
  const userId = ctx.from.id;
  const username = ctx.from.username || ctx.from.first_name;
  const lastMsg = ctx.message?.reply_to_message?.text || ctx.message?.text;

  if (!lastMsg || lastMsg.startsWith('/save')) {
    await ctx.reply('Vui lòng trả lời hoặc gửi tin nhắn cần lưu.');
    return;
  }
  try {
    let user = await UserModel.findOne({ userId });
    if (!user) {
      user = await UserModel.create({
        userId,
        username,
        createdAt: new Date(),
        messages: []
      });
    }
    user.messages.push({
      text: lastMsg,
      timestamp: new Date()
    });
    await user.save();

    await ctx.reply(`Tin nhắn của bạn đã được lưu lúc ${timeFormatter()}.`);
    await logManager.createLog('info', `Saved message for user ${userId}`, userId);
  } catch (err) {
    await ctx.reply('Lưu tin nhắn thất bại. Vui lòng thử lại.');
    await logManager.createLog('error', `Save failed for ${userId}: ${err.message}`, userId);
  }
}