import { z } from 'zod';

const ClassSchema = z.object({
	classId: z.number(),
	gradeId: z.number(),
	teacherId: z.number(),
	academicYearId: z.number(),
	schoolId: z.number(),
	className: z.number(),
	status: z.boolean(),
	description: z.string(),
	dateCreated: z.date(),
	dateUpdated: z.date(),
});
const TeacherSchema = z.object({
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
const EvaluationSchema = z.object({
	weeklyEvaluationId: z.number(),
	classId: z.number(),
	teacherId: z.number(),
	weekId: z.number(),
	monthEvaluation: z.number(),
	totalScore: z.number(),
	description: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const EvaluationRes = z.object({
	EvaluationSchema,
	teacher: TeacherSchema,
	class: ClassSchema,
});
export type EvaluationResType = z.TypeOf<typeof EvaluationRes>;

export const CreateEvaluationBody = z
	.object({
		weeklyEvaluationId: z.number(),
		classId: z.number(),
		teacherId: z.number(),
		weekId: z.number(),
		monthEvaluation: z.number(),
		totalScore: z.number(),
		description: z.string(),
	})
	.strict();
export type CreateEvaluationBodyType = z.TypeOf<typeof CreateEvaluationBody>;

export const UpdateEvaluationBody = CreateEvaluationBody;
export type UpdateEvaluationBodyType = z.TypeOf<typeof UpdateEvaluationBody>;
