import z from 'zod';

const SubjectSchema = z.object({
	subjectId: z.number(),
	subjectName: z.string(),
	gradeId: z.number(),
	gradeName: z.string(),
	displayAcademicYear_Name: z.string(),
	status: z.boolean(),
	yearStart: z.string(),
	yearEnd: z.string(),
});

export const SubjectRes = z.object({
	status: z.number(),
	message: z.string().nullable(),
	data: SubjectSchema,
	pagination: z.object({
		pageNumber: z.number(),
		pageSize: z.number(),
		totalResults: z.number(),
		totalPages: z.number(),
	}),
});
export type SubjectResType = z.TypeOf<typeof SubjectRes>;

export const SubjectListRes = z.object({
	status: z.number(),
	message: z.string().nullable(),
	data: z.array(SubjectSchema),
	pagination: z.object({
		pageNumber: z.number(),
		pageSize: z.number(),
		totalResults: z.number(),
		totalPages: z.number(),
	}),
});
export type SubjectListResType = z.TypeOf<typeof SubjectListRes>;

export const CreateSubjectBody = z.object({
	gradeId: z.number(),
	subjectId: z.number(),
	subjectName: z.string(),
	status: z.boolean(),
});
export type CreateSubjectBodyType = z.TypeOf<typeof CreateSubjectBody>;

export const UpdateSubjectBody = CreateSubjectBody;
export type UpdateSubjectBodyType = z.TypeOf<typeof UpdateSubjectBody>;
