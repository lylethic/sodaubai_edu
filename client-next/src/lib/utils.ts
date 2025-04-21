import { type ClassValue, clsx } from 'clsx';
import { UseFormSetError } from 'react-hook-form';
import { toast } from '@/components/ui/use-toast';
import { EntityError } from '@/lib/http';
import { twMerge } from 'tailwind-merge';
import jwt from 'jsonwebtoken';
import { JwtAccessTokenPayload } from '@/types/jwt';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const handleErrorApi = ({
	error,
	setError,
	duration,
}: {
	error: any;
	setError?: UseFormSetError<any>;
	duration?: number;
}) => {
	if (error instanceof EntityError && setError) {
		error.payload.errors.forEach((item) => {
			setError(item.field, {
				type: 'server',
				message: item.message,
			});
		});
	}
	// General error, such as incorrect email or password
	else {
		toast({
			title: 'Lỗi',
			description: error?.payload?.message ?? 'Lỗi không xác định',
			variant: 'destructive',
			duration: duration ?? 5000,
		});
	}
};

/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
export const normalizePath = (path: string) => {
	return path.startsWith('/') ? path.slice(1) : path;
};

/**
 *
 * @param str
 * @returns Chuyển chuỗi thành chữ thường
 */
export const normalizeString = (str: any) => str?.trim().toLowerCase() || '';

/**
 *
 * @param  morningPeriods afternoonPeriods
 * @returns
 */

export const morningPeriods = [1, 2, 3, 4, 5];
export const afternoonPeriods = [6, 7, 8, 9, 10];

export const decodeJWT = <Payload = JwtAccessTokenPayload>(
	token: string
): Payload | null => {
	try {
		const decoded = jwt.decode(token) as Payload | null;
		return decoded;
	} catch (error) {
		console.error('Error decoding JWT:', error);
		return null;
	}
};

const formatDate = (date: Date) => {
	return date.toLocaleDateString('vi-VN'); // Format as dd/MM/yyyy
};

export const parseDateFromDDMMYYYY = (dateString: string) => {
	if (!dateString) return new Date();

	const [day, month, year] = dateString.split('/').map(Number); // dd/MM/yyyy
	// Vietnam timezone (UTC+7)
	const date = new Date(year, month - 1, day);
	const localDate = new Date(date.getTime() + 7 * 60 * 60 * 1000); // Add 7 hours to match UTC+7
	return localDate;
};

export const normalizeDateToVietnam = (dateString: any) => {
	const [year, month, day] = dateString.split('-').map(Number); // Split and parse the date string
	return new Date(year, month - 1, day); // Construct local date (Vietnam time)
};

export const formatDateToVietnam = (date: any) => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

export function formatDateToDDMMYYYY(dateString: Date | null): string {
	if (!dateString) return '_';
	const date = new Date(dateString);
	return new Intl.DateTimeFormat('vi-VN', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,
	}).format(date);
}

export function formatDateToDDMMYYYYNoTime(dateString: Date | null): string {
	if (!dateString) return '_';
	const date = new Date(dateString);
	return new Intl.DateTimeFormat('vi-VN', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	}).format(date);
}
