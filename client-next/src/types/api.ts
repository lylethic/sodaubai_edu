/**
 * Standardized API response envelopes and query contracts matching backend .NET 8 models.
 */

export interface ApiResponse<T = any> {
	httpStatus: number;
	success: boolean;
	data: T;
	errorCode: string | null;
	message: string;
}

export interface PaginatedResponse<T> {
	items: T[];
	pageNumber: number;
	pageSize: number;
	totalCount: number;
}

export type ApiPaginatedResponse<T> = ApiResponse<PaginatedResponse<T>>;

export interface QueryObject {
	pageNumber?: number;
	pageSize?: number;
	keyword?: string | null;
	sortBy?: string | null;
	isDecsending?: boolean;
	[key: string]: any;
}

/**
 * Builds a query string from a query object, filtering out null/undefined values.
 */
export const buildQueryString = (
	query?: QueryObject | Record<string, any>
): string => {
	if (!query) return '';
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined && value !== null && value !== '') {
			params.append(key, String(value));
		}
	}
	const qs = params.toString();
	return qs ? `?${qs}` : '';
};
