import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { getDistance } from 'geolib';

// Extend dayjs with the relativeTime plugin
dayjs.extend(relativeTime);

export function getRelativeDate(inputDate: Date | string): string {
  return dayjs(inputDate).fromNow();
}

export const getDatesOfMonth = (year: number, month: number) => {
  const daysInMonth = dayjs(new Date(year, month)).daysInMonth();

  return Array.from({ length: daysInMonth }, (_, i) =>
    dayjs(new Date(year, month, i + 1))
  );
};
export function formatToDDMMYY(isoString: string): string {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0'); // dd
  const month = String(date.getMonth() + 1).padStart(2, '0'); // mm
  const year = String(date.getFullYear()).slice(-2); // yy

  return `${day} - ${month} - ${year}`;
}
