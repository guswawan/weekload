import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MS_IN_WEEK = 7 * 24 * 60 * 60 * 1000;

// ISO 8601 week number
export function getIsoWeek(date: Date = new Date()): number {
  const isoDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );

  const isoDay = isoDate.getUTCDay() || 7;
  isoDate.setUTCDate(isoDate.getUTCDate() + 4 - isoDay);

  const isoYear = isoDate.getUTCFullYear();
  const yearStart = new Date(Date.UTC(isoYear, 0, 1));
  const startDay = yearStart.getUTCDay() || 7;
  const firstThursday = new Date(yearStart);
  firstThursday.setUTCDate(yearStart.getUTCDate() + (4 - startDay));

  return (
    1 + Math.round((isoDate.getTime() - firstThursday.getTime()) / MS_IN_WEEK)
  );
}
