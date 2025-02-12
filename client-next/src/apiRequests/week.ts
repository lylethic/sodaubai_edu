import http from '@/lib/http';
import { MessageResType } from '@/schemaValidations/common.schema';
import {
	CreateWeekBodyType,
	DaysOfWeekResType,
	UpdateWeekBodyType,
	WeekListResType,
	WeekResType,
} from '@/schemaValidations/week.schema';
import { QueryType } from '@/types/queryType';

export const weekApiRequest = {
	weeks: (query: QueryType) =>
		http.get<WeekListResType>(
			`/Weeks?pageNumber=${query.pageNumber}&pageSize=${query.pageSize}`
		),

	weeksNoPagination: () => http.get<WeekResType>('/Weeks'),

	week: (id: number) => http.get<WeekListResType>(`/Weeks/${id}`),

	weekDetail: (id: number, token?: string) =>
		http.get<WeekResType>(`/Weeks/get-week-to-update/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}),

	// api/Weeks/Get7DaysInWeek?selectedWeekId=1
	getDaysOfWeek: (weekId: number | null) =>
		http.get<DaysOfWeekResType>(
			`/Weeks/Get7DaysInWeek?selectedWeekId=${weekId}`
		),

	create: (body: CreateWeekBodyType) =>
		http.post<MessageResType>('/Weeks', body),

	update: (id: number, body: UpdateWeekBodyType) =>
		http.put<MessageResType>(`/Weeks/${id}`, body),

	delete: (id: number) => http.delete<MessageResType>(`/Weeks/${id}`),

	bulkdelete: (ids: number[]) =>
		http.delete<MessageResType>('/Weeks/bulk-delete', ids),
};
