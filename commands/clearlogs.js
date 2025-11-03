// /clearlogs - Admin only. Backup then clear logs after confirmation.
import logManager from '../utils/logManager.js';

const ADMIN_ID = process.env.ADMIN_ID;
let pending = false;

export default async function(ctx) {
  if (`${ctx.from.id}` !== `${ADMIN_ID}`) {
    await ctx.reply('Bạn không có quyền sử dụng lệnh này.');
    await logManager.createLog('warn', 'Unauthorized clearlogs attempt', ctx.from.id);
    return;
  }
  if (!pending) {
    pending = true;
    await ctx.reply('Bạn có chắc muốn xoá tất cả logs? Gõ /clearlogs lần nữa để xác nhận.');
    return;
  }
  try {
    await logManager.clearLogs();
    pending = false;
    await ctx.reply('Tất cả logs đã được xoá và sao lưu.');
    await logManager.createLog('info', 'Admin cleared logs', ctx.from.id);
  } catch (err) {
    pending = false;
    await ctx.reply('Xoá logs thất bại.');
    await logManager.createLog('error', `Clearlogs failed: ${err.message}`, ctx.from.id);
  }
}