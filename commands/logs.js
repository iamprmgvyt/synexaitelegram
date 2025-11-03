// /logs - Show 10 latest logs (admin only)
import logManager from '../utils/logManager.js';
import timeFormatter from '../utils/timeFormatter.js';

const ADMIN_ID = process.env.ADMIN_ID;

export default async function(ctx) {
  if (`${ctx.from.id}` !== `${ADMIN_ID}`) {
    await ctx.reply('Bạn không có quyền sử dụng lệnh này.');
    await logManager.createLog('warn', 'Unauthorized logs access', ctx.from.id);
    return;
  }
  const logs = await logManager.listLogs(10);
  if (!logs.length) {
    await ctx.reply('Không có logs nào.');
    return;
  }
  const msg =
    logs.map(l =>
      `[${timeFormatter(l.timestamp)}] [${l.type.toUpperCase()}] [User:${l.userId ?? 'SYSTEM'}]\n${l.message}`
    ).join('\n\n');
  await ctx.reply(msg);
  await logManager.createLog('info', 'Admin viewed logs', ctx.from.id);
}