import z from 'zod';
/**
 * "displayAcademicYearName": "2024-2025",
      "yearStart": "2024-09-10",
      "yearEnd": "2025-09-15",
      "status": false,
      "gradeId": 1,
      "academicYearId": 22,
      "gradeName": "Khối 10",
      "description": "Khối 10",
      "dateCreated": null,
      "dateUpdated": null
 */
export const GradeSchema = z.object({
	gradeId: z.number(),
	gradeName: z.string(),
	academicYearId: z.number(),
	displayAcademicYearName: z.string(),
	yearStart: z.date(),
	yearEnd: z.date(),
	description: z.string(),
	dateCreated: z.date(),
	dateUpdated: z.date(),
});
export type GradeSchemaType = z.TypeOf<typeof GradeSchema>;

export const GradeRes = z
	.object({
		status: z.number(),
		message: z.string(),
		data: GradeSchema,
		pagination: z.object({
			pageNumber: z.number(),
			pageSize: z.number(),
			totalResults: z.number(),
			pagePages: z.number(),
		}),
	})
	.strict();
export type GradeResType = z.TypeOf<typeof GradeRes>;

export const GradeDetailRes = z.object({
	status: z.number(),
	message: z.string(),
	data: z.array(GradeSchema),
});
export type GradeDetailResType = z.TypeOf<typeof GradeDetailRes>;

export const CreateGradeBody = z.object({
	gradeId: z.number(),
	academicYearId: z.number(),
	gradeName: z.string(),
	description: z.string(),
	dateCreated: z.date().nullable(),
	dateUpdated: z.date().nullable(),
});
export type CreateGradeBodyType = z.TypeOf<typeof CreateGradeBody>;

export const UpdateGradeBody = CreateGradeBody;
export type UpdateGradeBodyType = z.TypeOf<typeof UpdateGradeBody>;
