import { z } from 'zod';

export const ClassSchema = z.object({
	classId: z.number().optional(),
	id: z.number().optional(),
	gradeId: z.number().optional(),
	teacherId: z.number().optional(),
	academicYearId: z.number().optional(),
	schoolId: z.number().optional(),
	className: z.string().optional(),
	name: z.string().optional(),
	status: z.boolean().optional(),
	description: z.string().nullable().optional(),
	dateCreated: z.union([z.string(), z.date()]).optional(),
	dateUpdated: z.union([z.string(), z.date()]).optional(),
});

export const TeacherSchema = z.object({
	teacherId: z.number().optional(),
	id: z.number().optional(),
	accountId: z.number().optional(),
	schoolId: z.number().optional(),
	fullname: z.string().optional(),
	dateOfBirth: z.union([z.string(), z.date()]).optional(),
	gender: z.boolean().optional(),
	address: z.string().optional(),
	status: z.boolean().optional(),
	dateCreate: z.union([z.string(), z.date()]).optional(),
	dateUpdate: z.union([z.string(), z.date()]).optional(),
	photoPath: z.string().nullable().optional(),
});

export const WeeklyEvaluationScoreItemSchema = z.object({
	weeklyEvaluationId: z.number().optional(),
	id: z.number().optional(),
	weekId: z.number().optional(),
	classId: z.number(),
	gradeId: z.number().optional(),
	gradeName: z.string().optional(),
	teacherId: z.number().optional(),
	className: z.string().optional(),
	totalScore: z.number(),
});
export type WeeklyEvaluationScoreItemDto = z.infer<
	typeof WeeklyEvaluationScoreItemSchema
>;
export type WeeklyStatisticByWeek = WeeklyEvaluationScoreItemDto;

export const ViewScoreListByWeekRes = z.object({
	status: z.number().optional(),
	httpStatus: z.number().optional(),
	message: z.string().optional(),
	data: z.array(WeeklyEvaluationScoreItemSchema),
});
export type ViewScoreListByWeekResType = z.infer<
	typeof ViewScoreListByWeekRes
>;

export const WeeklyEvaluationSchema = z.object({
	id: z.number().optional(),
	weeklyEvaluationId: z.number().optional(),
	classId: z.number(),
	teacherId: z.number(),
	weekId: z.number(),
	name: z.string().optional(),
	weekNameEvaluation: z.string().optional(),
	totalScore: z.number().optional().default(0),
	description: z.string().nullable().optional(),
	createdAt: z.union([z.string(), z.date()]).nullable().optional(),
	updatedAt: z.union([z.string(), z.date()]).nullable().optional(),
	dateCreated: z.union([z.string(), z.date()]).nullable().optional(),
	dateUpdated: z.union([z.string(), z.date()]).nullable().optional(),
	class: ClassSchema.optional().nullable(),
	teacher: TeacherSchema.optional().nullable(),
	className: z.string().optional(),
	gradeId: z.number().optional(),
	gradeName: z.string().optional(),
});
export type WeeklyEvaluationDto = z.infer<typeof WeeklyEvaluationSchema>;

export const WeeklyStatistics = z.object({
	status: z.number().optional(),
	httpStatus: z.number().optional(),
	message: z.string().optional(),
	data: z.union([WeeklyEvaluationSchema, z.array(WeeklyEvaluationSchema)]),
});
export type WeeklyStatisticsType = z.infer<typeof WeeklyStatistics>;

export const CreateWeeklyStatistics = z.object({
	weeklyEvaluationId: z.number().optional(),
	classId: z.number(),
	teacherId: z.number(),
	weekId: z.number(),
	weekNameEvaluation: z.string(),
	totalScore: z.number().optional(),
	description: z.string().nullable().optional(),
	createdAt: z.union([z.string(), z.date()]).optional(),
	updatedAt: z.union([z.string(), z.date()]).optional(),
});
export type CreateWeeklyStatisticsType = z.infer<
	typeof CreateWeeklyStatistics
>;

export const UpdateWeeklyStatistics = CreateWeeklyStatistics;
export type UpdateWeeklyStatisticsType = z.infer<
	typeof UpdateWeeklyStatistics
>;

export const normalizeWeeklyEvaluation = (
	item: any
): WeeklyEvaluationDto => {
	if (!item) return item;
	const id = item.id ?? item.weeklyEvaluationId ?? 0;
	return {
		...item,
		id,
		weeklyEvaluationId: id,
		weekNameEvaluation: item.weekNameEvaluation ?? item.name ?? '',
		name: item.name ?? item.weekNameEvaluation ?? '',
		totalScore: item.totalScore ?? 0,
	};
};
