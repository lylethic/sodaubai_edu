import { z } from 'zod';
import {
	createApiResponseSchema,
	createPaginatedResponseSchema,
} from './common.schema';

export const AcademicYearSchema = z.object({
	id: z.number(),
	academicYearId: z.number().optional(), // alias
	name: z.string({ required_error: 'Vui lòng nhập tên năm học' }),
	displayAcademicYearName: z.string().optional(), // alias
	yearStart: z.union([z.string(), z.date()]).nullable().optional(),
	yearEnd: z.union([z.string(), z.date()]).nullable().optional(),
	description: z.string().nullable().optional(),
	status: z.boolean(),
});

export type AcademicYearDto = z.infer<typeof AcademicYearSchema>;
export const NamHocSchema = AcademicYearSchema;
export type NamHocSchemaType = AcademicYearDto;

export const AcademicYearRes = createApiResponseSchema(AcademicYearSchema);
export type AcademicYearResType = z.infer<typeof AcademicYearRes>;

export const AcademicYearIdRes = AcademicYearRes;
export type AcademicYearIdResType = AcademicYearResType;

export const AcademicYearListRes = createApiResponseSchema(
	createPaginatedResponseSchema(AcademicYearSchema)
);
export type AcademicYearListResType = z.infer<typeof AcademicYearListRes>;

export const NamHocListRes = AcademicYearListRes;
export type NamHocListResType = AcademicYearListResType;

export const NamHocAddRes = AcademicYearRes;
export type NamHocAddResType = AcademicYearResType;

export const CreateNamHocBody = z.object({
	academicYearId: z.number().optional(),
	id: z.number().optional(),
	name: z.string().optional(),
	displayAcademicYearName: z.string().optional(),
	yearStart: z.union([z.string(), z.date()]).nullable().optional(),
	yearEnd: z.union([z.string(), z.date()]).nullable().optional(),
	description: z.string().nullable().optional(),
	status: z.boolean(),
});
export type CreateNamHocBodyType = z.infer<typeof CreateNamHocBody>;

export const UpdateNamHocBody = CreateNamHocBody;
export type UpdateNamHocBodyType = CreateNamHocBodyType;
