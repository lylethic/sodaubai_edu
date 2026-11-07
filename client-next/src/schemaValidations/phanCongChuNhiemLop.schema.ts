import { z } from 'zod';
import {
	createApiResponseSchema,
	createPaginatedResponseSchema,
} from './common.schema';

export const PhanCongChuNhiemSchema = z.object({
	id: z.number().optional(),
	phanCongChuNhiemId: z.number().default(0), // alias
	schoolId: z.number().optional().default(0),
	schoolName: z.string().optional().nullable(),
	teacherId: z.number().default(0),
	teacherName: z.string().optional().nullable(),
	gradeId: z.number().optional().default(0),
	classId: z.number().default(0),
	nameClass: z.string().optional().nullable(),
	academicYearId: z.number().default(0),
	academicYearName: z.string().optional().nullable(),
	description: z.string().optional().nullable(),
	status: z.boolean().default(true),
	dateCreated: z.union([z.string(), z.date()]).optional().nullable(),
	dateUpdated: z.union([z.string(), z.date()]).optional().nullable(),
	extendTeacher: z
		.object({
			fullname: z.string().optional().nullable(),
		})
		.optional()
		.nullable(),
	extendClass: z
		.object({
			className: z.string().optional().nullable(),
		})
		.optional()
		.nullable(),
});

export type PhanCongChuNhiemDto = z.infer<typeof PhanCongChuNhiemSchema>;
export type PhanCongChuNhiemSchemaType = PhanCongChuNhiemDto;

export const PhanCongChuNhiemRes = createApiResponseSchema(
	PhanCongChuNhiemSchema
);
export type PhanCongChuNhiemResType = z.infer<typeof PhanCongChuNhiemRes>;

export const PhanCongChuNhiemListRes = createApiResponseSchema(
	createPaginatedResponseSchema(PhanCongChuNhiemSchema)
);
export type PhanCongChuNhiemListResType = z.infer<
	typeof PhanCongChuNhiemListRes
>;

export const CreatePhanCongChuNhiemBody = z.object({
	id: z.number().optional(),
	phanCongChuNhiemId: z.number().optional(),
	teacherId: z
		.number({ required_error: 'Vui lòng chọn giáo viên' })
		.optional(),
	TeacherId: z.number().optional(),
	classId: z.number({ required_error: 'Vui lòng chọn lớp học' }).optional(),
	ClassId: z.number().optional(),
	academicYearId: z
		.number({ required_error: 'Vui lòng chọn năm học' })
		.optional(),
	AcademicYearId: z.number().optional(),
	status: z.boolean().default(true),
	Status: z.boolean().optional(),
	description: z.string().optional().nullable(),
	Description: z.string().optional().nullable(),
});
export type CreatePhanCongChuNhiemBodyType = z.infer<
	typeof CreatePhanCongChuNhiemBody
>;

export const UpdatePhanCongChuNhiemBody = CreatePhanCongChuNhiemBody;
export type UpdatePhanCongChuNhiemBodyType = CreatePhanCongChuNhiemBodyType;
