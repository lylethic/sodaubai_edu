import { z } from 'zod';

const SemesterSchema = z.object({
	semesterId: z.number(),
	semesterName: z.string(),
	dateStart: z.date(),
	dateEnd: z.date(),
	description: z.string(),
	status: z.boolean(),
	academicYearId: z.number(),
	displayAcademicYearName: z.string(),
	yearStart: z.date(),
	yearEnd: z.date(),
});

export const SemesterRes = z
	.object({
		status: z.number(),
		message: z.string(),
		data: SemesterSchema,
		pagination: z
			.object({
				pageNumber: z.number(),
				pageSize: z.number(),
				totalResults: z.number(),
				totalPages: z.number(),
			})
			.optional()
			.nullable(),
	})
	.strict();
export type SemesterResType = z.TypeOf<typeof SemesterRes>;

export const CreateSemesterBody = z.object({
	semesterId: z.number(),
	academicYearId: z.number(),
	semesterName: z.string(),
	dateStart: z.date(),
	dateEnd: z.date(),
	description: z.string(),
	status: z.boolean(),
});
export type CreateSemesterBodyType = z.TypeOf<typeof CreateSemesterBody>;

export const UpdateSemesterBody = CreateSemesterBody;
export type UpdateSemesterBodyType = z.TypeOf<typeof UpdateSemesterBody>;

export const SemesterListRes = z.object({
	message: z.string(),
	data: z.array(SemesterSchema),
});
export type SemesterListResType = z.TypeOf<typeof SemesterListRes>;
