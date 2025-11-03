// /start - Welcome message
import logManager from '../utils/logManager.js';

export default async function(ctx) {
  await ctx.reply('👋 Xin chào! Tôi là SynexAI, trợ lý AI trên Telegram. Gõ /help để xem các lệnh.');
  await logManager.createLog('info', 'User started bot', ctx.from.id);
}