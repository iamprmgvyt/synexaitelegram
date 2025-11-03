// Main entry point for SynexAI Telegram bot.
// Loads environment, initializes bot, sets up commands, error handling and database.
import 'dotenv/config';
import { Telegraf } from 'telegraf';
import mongoose from 'mongoose';
import chalk from 'chalk';
import { connectDB } from './database/connect.js';
import logManager from './utils/logManager.js';
import rateLimiter from './utils/rateLimiter.js';
import timeFormatter from './utils/timeFormatter.js';
import fs from 'fs';
import path from 'path';

// Load environment
const {
  BOT_TOKEN,
  ADMIN_ID,
  BOT_NAME,
  TIMEZONE
} = process.env;

if (!BOT_TOKEN) {
  console.error(chalk.red('BOT_TOKEN not set in environment.'));
  process.exit(1);
}

// Load commands dynamically
import startCommand from './commands/start.js';
import helpCommand from './commands/help.js';
import saveCommand from './commands/save.js';
import readCommand from './commands/read.js';
import logsCommand from './commands/logs.js';
import clearlogsCommand from './commands/clearlogs.js';
import restorelogsCommand from './commands/restorelogs.js';
import statsCommand from './commands/stats.js';

// Initialize bot
const bot = new Telegraf(BOT_TOKEN, { handlerTimeout: 9_000 });

// Middlewares
bot.use(rateLimiter);
bot.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    await logManager.createLog('error', err.message, ctx.from?.id);
    console.error(chalk.bgRed('[ERROR]'), chalk.red(err));
    if (ctx.reply) {
      await ctx.reply('Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.');
    }
  }
});

// Attach commands
bot.start((ctx) => startCommand(ctx));
bot.help((ctx) => helpCommand(ctx));
bot.command('save', (ctx) => saveCommand(ctx));
bot.command('read', (ctx) => readCommand(ctx));
bot.command('logs', (ctx) => logsCommand(ctx));
bot.command('clearlogs', (ctx) => clearlogsCommand(ctx));
bot.command('restorelogs', (ctx) => restorelogsCommand(ctx));
bot.command('stats', (ctx) => statsCommand(ctx));

// Catch all actions for logging (commands, warnings, errors)
bot.use(async (ctx, next) => {
  if (ctx.message && ctx.message.text) {
    const username = ctx.from.username || ctx.from.first_name;
    await logManager.createLog('command', ctx.message.text, ctx.from.id);
    console.log(chalk.blueBright(`[${timeFormatter()}] [COMMAND]`), `${username}: ${ctx.message.text}`);
  }
  await next();
});

// Setup graceful shutdown
process.on('SIGINT', async () => {
  console.log(chalk.yellow('\nBot is stopping...'));
  await logManager.createLog('info', 'Bot stopped', ADMIN_ID);
  process.exit(0);
});
process.on('unhandledRejection', async (err) => {
  await logManager.createLog('error', err.message, ADMIN_ID);
  console.error(chalk.bgRed('[UNHANDLED ERROR]'), chalk.red(err));
});

// Start
(async () => {
  await connectDB();
  bot.launch().then(() =>
    console.log(chalk.greenBright(`[${timeFormatter()}] ✅ SynexAI Bot started!`))
  )
  .catch(async (e) => {
    await logManager.createLog('error', `Launch failed: ${e.message}`, ADMIN_ID);
    console.error(chalk.red('Telegram launch error:'), e);
    process.exit(1);
  });

  // Enable graceful restart and database auto-reconnect
  mongoose.connection.on('disconnected', async () => {
    console.warn(chalk.yellow('MongoDB disconnected. Retrying...'));
    await logManager.createLog('warn', 'MongoDB disconnected', ADMIN_ID);
    setTimeout(connectDB, 3000);
  });
})();