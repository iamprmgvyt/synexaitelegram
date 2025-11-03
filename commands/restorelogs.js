// /restorelogs — Admin only. Restore logs from backup.
import logManager from '../utils/logManager.js';

const ADMIN_ID = process.env.ADMIN_ID;

export default async function(ctx) {
  if (`${ctx.from.id}` !== `${ADMIN_ID}`) {
    await ctx.reply('Bạn không có quyền sử dụng lệnh này.');
    await logManager.createLog('warn', 'Unauthorized restorelogs attempt', ctx.from.id);
    return;
  }
  try {
    await logManager.restoreLogs();
    await ctx.reply('Logs đã được phục hồi từ bản sao lưu.');
    await logManager.createLog('info', 'Admin restored logs from backup', ctx.from.id);
  } catch (err) {
    await ctx.reply('Phục hồi logs thất bại.');
    await logManager.createLog('error', `Restorelogs failed: ${err.message}`, ctx.from.id);
  }
}