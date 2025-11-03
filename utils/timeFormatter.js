// Format timestamps to Vietnam time for logs and user messages.
import { vietnamFormat } from './lib/timezoneVietnam.js';

export default function timeFormatter(date = new Date()) {
  return vietnamFormat(date, 'HH:mm:ss DD/MM/YYYY');
}