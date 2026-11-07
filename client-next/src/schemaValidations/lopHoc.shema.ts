import { z } from 'zod';
import {
	createApiResponseSchema,
	createPaginatedResponseSchema,
} from './common.schema';

export const LopHocSchema = z.object({
	id: z.number().optional(),
	classId: z.number().default(0),
	name: z.string().optional(),
	className: z.string().default(''),
	gradeId: z.number().optional().nullable(),
	gradeName: z.string().optional().nullable(),
	teacherId: z.number().optional().nullable(),
	teacherName: z.string().optional().nullable(),
	academicYearId: z.number().optional().nullable(),
	nienKhoa: z.string().optional().nullable(),
	schoolId: z.number().optional().nullable(),
	schoolName: z.string().optional().nullable(),
	schoolLevel: z.number().optional().nullable(),
	status: z.boolean().default(true),
	description: z.string().optional().nullable(),
	dateCreated: z.union([z.string(), z.date()]).optional().nullable(),
	dateUpdated: z.union([z.string(), z.date()]).optional().nullable(),
});

export type LopHocSchemaType = z.infer<typeof LopHocSchema>;
export type ClassDetailsDto = LopHocSchemaType;
export type ClassDto = LopHocSchemaType;

export const LopHocRes = createApiResponseSchema(LopHocSchema);
export type LopHocResType = z.infer<typeof LopHocRes>;

export const LopHocListRes = createApiResponseSchema(
	createPaginatedResponseSchema(LopHocSchema)
);
export type LopHocListResType = z.infer<typeof LopHocListRes>;

export const LopHocResDetailsToUpdate = LopHocRes;
export type LopHocResDetailsToUpdateType = LopHocResType;

export const CreateLopHocBody = z.object({
	id: z.number().optional(),
	classId: z.number().optional(),
	className: z.string().optional(),
	ClassName: z.string().optional(),
	name: z.string().optional(),
	gradeId: z.number().optional(),
	GradeId: z.number().optional(),
	teacherId: z.number().optional(),
	TeacherId: z.number().optional(),
	academicYearId: z.number().optional(),
	AcademicYearId: z.number().optional(),
	schoolId: z.number().optional(),
	SchoolId: z.number().optional(),
	status: z.boolean().optional(),
	Status: z.boolean().optional(),
	description: z.string().optional().nullable(),
	Description: z.string().optional().nullable(),
});

export type CreateLopHocBodyType = z.infer<typeof CreateLopHocBody>;

export const UpdateLopHocBody = CreateLopHocBody;
export type UpdateLopHocBodyType = z.infer<typeof UpdateLopHocBody>;
