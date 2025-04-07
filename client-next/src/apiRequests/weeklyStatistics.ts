import http from '@/lib/http';
import { MessageResType } from '@/schemaValidations/common.schema';
import {
	CreateWeeklyStatisticsType,
	UpdateWeeklyStatisticsType,
	ViewScoreListByWeekResType,
	WeeklyStatisticsType,
} from '@/schemaValidations/weekly-statistics';

export const weeklyStatisticsApiRequest = {
	weeklyEvaluations: (weekId: number) =>
		http.get<WeeklyStatisticsType>(`/WeeklyEvaluations?weekId=${weekId}`),

	create: (body: CreateWeeklyStatisticsType) =>
		http.post<MessageResType>('/WeeklyEvaluations', body),

	weeklyEvaluationsById: (id: number) =>
		http.get<WeeklyStatisticsType>(`/weeklyEvaluations/${id}`),

	update: (id: number, body: UpdateWeeklyStatisticsType) =>
		http.put<MessageResType>(`/WeeklyEvaluations/${id}`, body),

	delete: (id: number) =>
		http.delete<MessageResType>(`/WeeklyEvaluations/${id}`),

	bulkdelete: (ids: number[]) =>
		http.delete<MessageResType>(`/WeeklyEvaluations/bulk-delete`, ids),

	viewScoreByWeekId: (weekId: number) =>
		http.get(`/WeeklyEvaluations/get-score/${weekId}`),

	viewScoreListByWeek: (schoolId: number, weekId: number, gradeId: number) =>
		http.get<ViewScoreListByWeekResType>(
			`/WeeklyEvaluations/get-score-by-week?schoolId=${schoolId}&weekId=${weekId}&gradeId=${gradeId}`
		),
};
