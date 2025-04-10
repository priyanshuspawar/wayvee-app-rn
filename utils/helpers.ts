import dayjs from 'dayjs';

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
