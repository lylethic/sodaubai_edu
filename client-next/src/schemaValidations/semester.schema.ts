import { z } from 'zod';
import {
	createApiResponseSchema,
	createPaginatedResponseSchema,
} from './common.schema';

export const SemesterSchema = z.object({
	semesterId: z.number(),
	id: z.number().optional(), // alias
	academicYearId: z.number(),
	semesterName: z.string({ required_error: 'Vui lòng nhập tên học kỳ' }),
	name: z.string().optional(), // alias
	dateStart: z.union([z.string(), z.date()]).nullable().optional(),
	dateEnd: z.union([z.string(), z.date()]).nullable().optional(),
	description: z.string().nullable().optional(),
	status: z.boolean(),
	displayAcademicYearName: z.string().nullable().optional(),
	yearStart: z.union([z.string(), z.date()]).nullable().optional(),
	yearEnd: z.union([z.string(), z.date()]).nullable().optional(),
});

export type SemesterDto = z.infer<typeof SemesterSchema>;
export type SemesterType = SemesterDto;

export const SemesterRes = createApiResponseSchema(SemesterSchema);
export type SemesterResType = z.infer<typeof SemesterRes>;

export const SemesterListRes = createApiResponseSchema(
	createPaginatedResponseSchema(SemesterSchema)
);
export type SemesterListResType = z.infer<typeof SemesterListRes>;

export const CreateSemesterBody = z.object({
	semesterId: z.number().optional(),
	academicYearId: z.number({ required_error: 'Vui lòng chọn năm học' }),
	semesterName: z.string({ required_error: 'Vui lòng nhập tên học kỳ' }),
	dateStart: z.union([z.string(), z.date()]).nullable().optional(),
	dateEnd: z.union([z.string(), z.date()]).nullable().optional(),
	description: z.string().nullable().optional(),
	status: z.boolean(),
});
export type CreateSemesterBodyType = z.infer<typeof CreateSemesterBody>;

export const UpdateSemesterBody = CreateSemesterBody;
export type UpdateSemesterBodyType = z.infer<typeof UpdateSemesterBody>;
