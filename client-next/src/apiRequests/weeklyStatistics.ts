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
		http.get<WeeklyStatisticsType>(
			`/v1/weekly-evaluations?weekId=${weekId}`
		),

	create: (body: CreateWeeklyStatisticsType) =>
		http.post<MessageResType>('/v1/weekly-evaluations', body),

	weeklyEvaluationsById: (id: number) =>
		http.get<WeeklyStatisticsType>(`/v1/weekly-evaluations/${id}`),

	update: (id: number, body: UpdateWeeklyStatisticsType) =>
		http.put<MessageResType>(`/v1/weekly-evaluations/${id}`, body),

	delete: (id: number) =>
		http.delete<MessageResType>(`/v1/weekly-evaluations/${id}`),

	bulkdelete: (ids: number[]) =>
		http.delete<MessageResType>(`/v1/weekly-evaluations/bulk-delete`, ids),

	viewScoreByWeekId: (weekId: number) =>
		http.get<number | { totalScore: number }>(
			`/v1/weekly-evaluations/get-score/${weekId}`
		),

	viewScoreListByWeek: (schoolId: number, weekId: number, gradeId: number) =>
		http.get<ViewScoreListByWeekResType>(
			`/v1/weekly-evaluations/get-score-by-week?schoolId=${schoolId}&weekId=${weekId}&gradeId=${gradeId}`
		),
};

export default weeklyStatisticsApiRequest;
