// Simple rate limiter middleware for Telegraf (per user)
// Prevents spamming by limiting to 1 command/second.
const rateMap = new Map();
const WINDOW_MS = 1000;

export default async (ctx, next) => {
  const userId = ctx.from?.id;
  if (!userId) return await next();

  const now = Date.now();
  const lastTime = rateMap.get(userId) || 0;
  if (now - lastTime < WINDOW_MS) {
    if (ctx.reply) {
      await ctx.reply('Bạn thao tác quá nhanh. Vui lòng chờ một chút.');
    }
    return;
  }
  rateMap.set(userId, now);
  await next();
};