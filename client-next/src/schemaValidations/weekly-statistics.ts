import { z } from 'zod';

const classSchema = z.object({
	classId: z.number(),
	gradeId: z.number(),
	teacherId: z.number(),
	academicYearId: z.number(),
	schoolId: z.number(),
	className: z.string(),
	status: z.boolean(),
	description: z.string(),
	dateCreated: z.date(),
	dateUpdated: z.date(),
});

const teacherSchema = z.object({
	teacherId: z.number(),
	accountId: z.number(),
	schoolId: z.number(),
	fullname: z.string(),
	dateOfBirth: z.date(),
	gender: z.boolean(),
	address: z.string(),
	status: z.boolean(),
	dateCreate: z.date(),
	dateUpdate: z.date(),
	photoPath: z.string(),
});

export const WeeklyStatistics = z.object({
	status: z.number(),
	message: z.string(),
	data: z.object({
		weeklyEvaluationId: z.number(),
		classId: z.number(),
		teacherId: z.number(),
		weekId: z.number(),
		weekNameEvaluation: z.string(),
		totalScore: z.number(),
		description: z.string(),
		createdAt: z.date(),
		updatedAt: z.date(),
		class: classSchema,
		teacher: teacherSchema,
	}),
});
export type WeeklyStatisticsType = z.TypeOf<typeof WeeklyStatistics>;

export const CreateWeeklyStatistics = z.object({
	weeklyEvaluationId: z.number(),
	classId: z.number(),
	teacherId: z.number(),
	weekId: z.number(),
	weekNameEvaluation: z.string(),
	totalScore: z.number(),
	description: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
});
export type CreateWeeklyStatisticsType = z.TypeOf<
	typeof CreateWeeklyStatistics
>;

export const UpdateWeeklyStatistics = CreateWeeklyStatistics;
export type UpdateWeeklyStatisticsType = z.TypeOf<
	typeof UpdateWeeklyStatistics
>;
