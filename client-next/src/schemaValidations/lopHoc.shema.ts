import { z } from 'zod';

export const LopHocSchema = z.object({
	classId: z.number(),
	gradeId: z.number(),
	teacherId: z.number(),
	academicYearId: z.number(),
	schoolId: z.number(),
	className: z.string(),
	status: z.boolean(),
	description: z.string().optional(),
	dateCreated: z.date().optional().nullable(),
	dateUpdated: z.date().optional().nullable(),
});

export type LopHocSchemaType = z.TypeOf<typeof LopHocSchema>;

const LopHocDetail = z.object({
	classId: z.number(),
	schoolId: z.number(),
	schoolName: z.string(),
	teacherId: z.number(),
	teacherName: z.string(),
	gradeId: z.number(),
	gradeName: z.string(),
	nienKhoa: z.string(),
	academicYearId: z.number(),
	className: z.string(),
	status: z.boolean(),
	description: z.string().optional(),
	dateCreated: z.date().optional(),
	dateUpdated: z.date().optional(),
});

const LopHocRes = z
	.object({
		message: z.string(),
		data: LopHocDetail,
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

export type LopHocResType = z.TypeOf<typeof LopHocRes>;

const LopHocResDetailsToUpdate = z.object({
	message: z.string(),
	data: LopHocSchema,
});
export type LopHocResDetailsToUpdateType = z.TypeOf<
	typeof LopHocResDetailsToUpdate
>;

export const CreateLopHocBody = z.object({
	GradeId: z.number(),
	TeacherId: z.number(),
	AcademicYearId: z.number(),
	SchoolId: z.number(),
	ClassName: z.string(),
	Status: z.boolean(),
	Description: z.string(),
});

export type CreateLopHocBodyType = z.TypeOf<typeof CreateLopHocBody>;

export const LopHocListRes = z.object({
	message: z.string(),
	data: z.array(LopHocSchema),
});

export const UpdateLopHocBody = CreateLopHocBody;
export type UpdateLopHocBodyType = z.TypeOf<typeof UpdateLopHocBody>;
