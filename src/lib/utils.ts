import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

const MILLISECONDS_IN_DAY = 86400000; // 24 jam * 60 menit * 60 detik * 1000 ms

export function getIsoWeek(inputDate: Date): number {
	const workingDate = new Date(
		Date.UTC(
			inputDate.getFullYear(),
			inputDate.getMonth(),
			inputDate.getDate(),
		),
	);

	const dayOfWeek = workingDate.getUTCDay() || 7;
	workingDate.setUTCDate(workingDate.getUTCDate() + 4 - dayOfWeek);

	const isoYear = workingDate.getUTCFullYear();
	const firstDayOfYear = new Date(Date.UTC(isoYear, 0, 1));

	const differenceInMilliseconds =
		workingDate.getTime() - firstDayOfYear.getTime();

	const differenceInDays = differenceInMilliseconds / MILLISECONDS_IN_DAY;

	return Math.ceil((differenceInDays + 1) / 7);
}

export function getIsoWeeksInYear(year: number): number {
	const date = new Date(year, 0, 1);
	const isLeap = new Date(year, 1, 29).getMonth() === 1;
	const day = date.getDay();

	if (day === 4 || (isLeap && day === 3)) {
		return 53;
	}
	return 52;
}
