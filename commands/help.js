// /help - Command list in English, but reply in Vietnamese
import logManager from '../utils/logManager.js';

const helpMessages = [
  '/start — Greet the user with a welcome message from SynexAI.',
  '/help — Display all available commands with short English descriptions.',
  '/save — Save the user\'s latest message or chat context into MongoDB.',
  '/read — Retrieve and display all saved messages for that user.',
  '/logs — (admin only) Display the 10 most recent system logs with timestamps.',
  '/clearlogs — (admin only) Delete all logs after confirmation, with automatic backup.',
  '/restorelogs — (admin only) Restore logs from the latest backup.',
  '/stats — Show total users, saved messages, and total log count.'
];

export default async function(ctx) {
  await ctx.reply('📑 Danh sách lệnh:\n' +
    helpMessages.map(m => `• ${m}`).join('\n')
    + '\n\nMọi câu trả lời sẽ bằng tiếng Việt.');
  await logManager.createLog('info', 'User requested help', ctx.from.id);
}