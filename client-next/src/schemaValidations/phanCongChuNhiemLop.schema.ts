import z from 'zod';

export const PhanCongChuNhiemSchema = z.object({
	phanCongChuNhiemId: z.number(),
	schoolId: z.number(),
	schoolName: z.string(),
	teacherId: z.number(),
	teacherName: z.string(),
	gradeId: z.number(),
	classId: z.number(),
	nameClass: z.string(),
	academicYearId: z.number(),
	academicYearName: z.string(),
	description: z.string(),
	status: z.boolean(),
	dateCreated: z.date(),
	dateUpdated: z.date(),
});

export const PhanCongChuNhiemRes = z.object({
	status: z.number(),
	message: z.string(),
	data: PhanCongChuNhiemSchema,
	pagination: z
		.object({
			pageNumber: z.number(),
			pageSize: z.number(),
			totalResults: z.number(),
			totalPages: z.number(),
		})
		.optional()
		.nullable(),
});
export type PhanCongChuNhiemResType = z.TypeOf<typeof PhanCongChuNhiemRes>;

export const PhanCongChuNhiemListRes = z.object({
	message: z.string(),
	data: z.array(PhanCongChuNhiemSchema),
});
export type PhanCongChuNhiemListResType = z.TypeOf<
	typeof PhanCongChuNhiemListRes
>;

export const CreatePhanCongChuNhiemBody = z.object({
	TeacherId: z.number(),
	ClassId: z.number(),
	AcademicYearId: z.number(),
	Status: z.boolean(),
	Description: z.string(),
});
export type CreatePhanCongChuNhiemBodyType = z.TypeOf<
	typeof CreatePhanCongChuNhiemBody
>;

export const UpdatePhanCongChuNhiemBody = z.object({
	phanCongChuNhiemId: z.number(),
	teacherId: z.number(),
	classId: z.number(),
	academicYearId: z.number(),
	status: z.boolean(),
	description: z.string(),
});
export type UpdatePhanCongChuNhiemBodyType = z.TypeOf<
	typeof UpdatePhanCongChuNhiemBody
>;
