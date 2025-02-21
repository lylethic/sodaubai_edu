import http from '@/lib/http';
import {
	CreateWeeklyStatisticsType,
	UpdateWeeklyStatisticsType,
	WeeklyStatisticsType,
} from '@/schemaValidations/weekly-statistics';

export const weeklyStatisticsApiRequest = {
	weeklyEvaluations: (weekId: number) =>
		http.get<WeeklyStatisticsType>(`/WeeklyEvaluations?weekId=${weekId}`),

	create: (body: CreateWeeklyStatisticsType) =>
		http.post('/WeeklyEvaluations', body),

	weeklyEvaluationsById: (id: number) =>
		http.get<WeeklyStatisticsType>(`/weeklyEvaluations/${id}`),

	update: (id: number, body: UpdateWeeklyStatisticsType) =>
		http.put(`/WeeklyEvaluations/${id}`, body),

	delete: (id: number) => http.delete(`/WeeklyEvaluations/${id}`),

	bulkdelete: (ids: number[]) =>
		http.delete(`/WeeklyEvaluations/bulk-delete`, ids),

	viewScoreByWeekId: (weekId: number) =>
		http.get(`/WeeklyEvaluations/get-score/${weekId}`),
};
