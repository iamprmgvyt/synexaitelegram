// Util for getting Vietnam-time-aware Date objects.
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';
import 'dayjs/locale/vi';

dayjs.extend(utc);
dayjs.extend(tz);

const VIETNAM_TZ = 'Asia/Ho_Chi_Minh';

export const vietnamDate = () => {
  return dayjs().tz(VIETNAM_TZ);
};
export const vietnamFormat = (date = new Date(), fmt = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(date).tz(VIETNAM_TZ).format(fmt);
};