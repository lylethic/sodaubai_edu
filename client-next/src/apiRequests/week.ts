import http from '@/lib/http';
import { MessageResType } from '@/schemaValidations/common.schema';
import {
	CreateWeekBodyType,
	DaysOfWeekResType,
	UpdateWeekBodyType,
	WeekListResType,
	WeekResType,
} from '@/schemaValidations/week.schema';
import { ApiResponse, buildQueryString, QueryObject } from '@/types/api';
import { QueryType } from '@/types/queryType';

export const weekApiRequest = {
	weeks: (query: QueryType & { semesterId?: number }, token?: string) =>
		http.get<WeekListResType>(
			`/v1/weeks${buildQueryString(query as QueryObject)}`,
			{
				token,
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				cache: 'no-store',
			}
		),

	weeksNoPagination: (semesterId?: number, token?: string) => {
		const query: Record<string, any> = { pageNumber: 1, pageSize: 1000 };
		if (semesterId) query.semesterId = semesterId;
		return http.get<WeekListResType>(`/v1/weeks${buildQueryString(query)}`, {
			token,
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
			cache: 'no-store',
		});
	},

	week: (id: number, token?: string) =>
		http.get<WeekResType>(`/v1/weeks/${id}`, {
			token,
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
			cache: 'no-store',
		}),

	weekDetail: (id: number, token?: string) =>
		http.get<WeekResType>(`/v1/weeks/get-week-to-update/${id}`, {
			token,
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
			cache: 'no-store',
		}),

	getDaysOfWeek: (weekId: number | null, token?: string) =>
		http.get<DaysOfWeekResType>(
			`/v1/weeks/Get7DaysInWeek?selectedWeekId=${weekId}`,
			{
				token,
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				cache: 'no-store',
			}
		),

	create: (body: CreateWeekBodyType) => {
		const payload = {
			semesterId: body.semesterId,
			weekName: body.weekName,
			weekStart: body.weekStart ? new Date(body.weekStart).toISOString() : null,
			weekEnd: body.weekEnd ? new Date(body.weekEnd).toISOString() : null,
			status: body.status,
		};
		return http.post<WeekResType>('/v1/weeks', payload);
	},

	update: (id: number, body: UpdateWeekBodyType) => {
		const payload = {
			weekId: id,
			semesterId: body.semesterId,
			weekName: body.weekName,
			weekStart: body.weekStart ? new Date(body.weekStart).toISOString() : null,
			weekEnd: body.weekEnd ? new Date(body.weekEnd).toISOString() : null,
			status: body.status,
		};
		return http.put<WeekResType>(`/v1/weeks/${id}`, payload);
	},

	delete: (id: number) =>
		http.delete<ApiResponse<boolean>>(`/v1/weeks/${id}`),

	bulkdelete: (ids: number[]) =>
		http.delete<ApiResponse<boolean>>('/v1/weeks/bulk-delete', ids),

	upload: (file: FormData) =>
		http.post<MessageResType>('/v1/weeks/upload', file),
};

export default weekApiRequest;
