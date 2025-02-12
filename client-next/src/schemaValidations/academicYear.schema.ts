import { z } from 'zod';

const AcademicYearRes = z
	.object({
		message: z.string(),
		total: z.number().nullable(),
		data: z.object({
			academicYearId: z.number(),
			displayAcademicYearName: z.string(),
			yearStart: z.date(),
			yearEnd: z.date(),
			description: z.string().optional(),
			status: z.boolean(),
		}),
		pagination: z.object({
			pageNumber: z.number(),
			pageSize: z.number(),
			totalPages: z.number(),
			totalResults: z.number(),
		}),
	})
	.strict();

export type AcademicYearResType = z.TypeOf<typeof AcademicYearRes>;

const AcademicYearIdRes = z.object({
	message: z.string(),
	data: z.object({
		academicYearId: z.number(),
		displayAcademicYearName: z.string(),
		yearStart: z.date(),
		yearEnd: z.date(),
		description: z.string(),
		status: z.boolean(),
	}),
});

export type AcademicYearIdResType = z.TypeOf<typeof AcademicYearIdRes>;

export const CreateNamHocBody = z.object({
	academicYearId: z.number(),
	displayAcademicYearName: z.string(),
	yearStart: z.date(),
	yearEnd: z.date(),
	description: z.string().optional(),
	status: z.boolean(),
});
export type CreateNamHocBodyType = z.TypeOf<typeof CreateNamHocBody>;

export const NamHocSchema = z.object({
	academicYearId: z.number(),
	displayAcademicYearName: z.string(),
	yearStart: z.date(),
	yearEnd: z.date(),
	description: z.string().optional(),
	status: z.boolean(),
});

export const NamHocAddRes = z.object({
	message: z.string(),
	data: NamHocSchema,
});
export type NamHocAddResType = z.TypeOf<typeof NamHocSchema>;

export const NamHocListRes = z.object({
	message: z.string(),
	data: z.array(NamHocSchema),
});
export type NamHocListResType = z.TypeOf<typeof NamHocSchema>;

export const UpdateNamHocBody = CreateNamHocBody;
export type UpdateNamHocBodyType = CreateNamHocBodyType;
