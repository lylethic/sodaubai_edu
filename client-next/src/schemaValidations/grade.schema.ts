import { z } from 'zod';
import {
	createApiResponseSchema,
	createPaginatedResponseSchema,
} from './common.schema';

export const GradeSchema = z.object({
	id: z.number(),
	gradeId: z.number().optional(), // alias
	name: z.string({ required_error: 'Vui lòng nhập tên khối lớp' }),
	gradeName: z.string().optional(), // alias
	academicYearId: z.number({ required_error: 'Vui lòng chọn năm học' }),
	description: z.string().nullable().optional(),
	displayAcademicYearName: z.string().nullable().optional(),
	yearStart: z.union([z.string(), z.date()]).nullable().optional(),
	yearEnd: z.union([z.string(), z.date()]).nullable().optional(),
	status: z.boolean().nullable().optional(),
	dateCreated: z.union([z.string(), z.date()]).nullable().optional(),
	dateUpdated: z.union([z.string(), z.date()]).nullable().optional(),
});

export type GradeDto = z.infer<typeof GradeSchema>;
export type GradeSchemaType = GradeDto;

export const GradeRes = createApiResponseSchema(GradeSchema);
export type GradeResType = z.infer<typeof GradeRes>;

export const GradeListRes = createApiResponseSchema(
	createPaginatedResponseSchema(GradeSchema)
);
export type GradeListResType = z.infer<typeof GradeListRes>;

export const GradeDetailRes = GradeRes;
export type GradeDetailResType = GradeResType;

export const CreateGradeBody = z.object({
	id: z.number().optional(),
	gradeId: z.number().optional(),
	academicYearId: z.number({ required_error: 'Vui lòng chọn năm học' }),
	name: z.string().optional(),
	gradeName: z.string().optional(),
	description: z.string().nullable().optional(),
	dateCreated: z.union([z.string(), z.date()]).nullable().optional(),
	dateUpdated: z.union([z.string(), z.date()]).nullable().optional(),
});
export type CreateGradeBodyType = z.infer<typeof CreateGradeBody>;

export const UpdateGradeBody = CreateGradeBody;
export type UpdateGradeBodyType = CreateGradeBodyType;
