import { z } from 'zod';
import {
	createApiResponseSchema,
	createPaginatedResponseSchema,
} from './common.schema';

export const SubjectSchema = z.object({
	id: z.number().optional(),
	subjectId: z.number().default(0),
	name: z.string().optional(),
	subjectName: z.string().default(''),
	gradeId: z.number().optional().nullable(),
	gradeName: z.string().optional().nullable(),
	displayAcademicYear_Name: z.string().optional().nullable(),
	status: z.boolean().default(true),
	yearStart: z.union([z.string(), z.date()]).optional().nullable(),
	yearEnd: z.union([z.string(), z.date()]).optional().nullable(),
	description: z.string().optional().nullable(),
	dateCreated: z.union([z.string(), z.date()]).optional().nullable(),
	dateUpdated: z.union([z.string(), z.date()]).optional().nullable(),
});

export type SubjectSchemaType = z.infer<typeof SubjectSchema>;
export type SubjectDto = SubjectSchemaType;

export const SubjectRes = createApiResponseSchema(SubjectSchema);
export type SubjectResType = z.infer<typeof SubjectRes>;

export const SubjectListRes = createApiResponseSchema(
	createPaginatedResponseSchema(SubjectSchema)
);
export type SubjectListResType = z.infer<typeof SubjectListRes>;

export const CreateSubjectBody = z.object({
	id: z.number().optional(),
	subjectId: z.number().optional(),
	name: z.string().optional(),
	subjectName: z.string().optional(),
	gradeId: z.number().optional().nullable(),
	status: z.boolean().optional(),
	description: z.string().optional().nullable(),
});
export type CreateSubjectBodyType = z.infer<typeof CreateSubjectBody>;

export const UpdateSubjectBody = CreateSubjectBody;
export type UpdateSubjectBodyType = z.infer<typeof UpdateSubjectBody>;
