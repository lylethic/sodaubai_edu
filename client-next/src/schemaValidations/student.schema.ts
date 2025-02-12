import z from 'zod';

const StudentSchema = z.object({
	schoolId: z.number(),
	accountId: z.number(),
	studentId: z.number(),
	gradeId: z.number(),
	classId: z.number(),
	roleId: z.number(),
	schoolName: z.string(),
	className: z.string(),
	email: z.string(),
	fullname: z.string(),
	status: z.boolean(),
	description: z.string().nullable(),
	dateCreated: z.date().nullable(),
	dateUpdated: z.date().nullable(),
	address: z.string(),
	dateOfBirth: z.date(),
});

export const StudentRes = z.object({
	status: z.number(),
	message: z.string(),
	data: StudentSchema,
	pagination: z.object({
		pageNumber: z.number(),
		pageSize: z.number(),
		totalResults: z.number(),
		totalPages: z.number(),
	}),
});
export type StudentResType = z.TypeOf<typeof StudentRes>;

export const CreateStudentBody = z.object({
	studentId: z.number(),
	classId: z.number(),
	gradeId: z.number(),
	accountId: z.number(),
	fullname: z.string(),
	status: z.boolean(),
	description: z.string(),
	dateCreated: z.date().nullable(),
	dateUpdated: z.date().nullable(),
	address: z.string(),
	dateOfBirth: z.date(),
});
export type CreateStudentBodyType = z.TypeOf<typeof CreateStudentBody>;

export const UpdateStudentBody = CreateStudentBody;
export type UpdateStudentBodyType = z.TypeOf<typeof UpdateStudentBody>;

export const StudentListRes = z.object({
	message: z.string(),
	data: z.array(StudentSchema),
});
export type StudentListResType = z.TypeOf<typeof StudentListRes>;
