import { z } from 'zod';
import {
	createApiResponseSchema,
	createPaginatedResponseSchema,
} from './common.schema';

export const TeacherSchema = z.object({
	id: z.number().optional(),
	teacherId: z.number().default(0), // alias
	userId: z.number().optional(),
	accountId: z.number().default(0), // alias
	schoolId: z.number().default(0),
	fullname: z.string().default(''),
	dateOfBirth: z.union([z.string(), z.date()]).optional().nullable(),
	gender: z.boolean().default(true),
	address: z.string().optional().nullable(),
	status: z.boolean().default(true),
	photoPath: z.string().optional().nullable(),
	nameSchool: z.string().optional().nullable(),
	schoolType: z.boolean().optional().nullable(),
	dateCreate: z.union([z.string(), z.date()]).optional().nullable(),
	dateUpdate: z.union([z.string(), z.date()]).optional().nullable(),
	dateCreated: z.union([z.string(), z.date()]).optional().nullable(),
	dateUpdated: z.union([z.string(), z.date()]).optional().nullable(),
});

export type TeacherDto = z.infer<typeof TeacherSchema>;
export type TeacherSchemaType = TeacherDto;

export const TeacherRes = createApiResponseSchema(TeacherSchema);
export type TeacherResType = z.infer<typeof TeacherRes>;

export const TeacherDetailRes = TeacherRes;
export type TeacherDetailResType = TeacherResType;

export const TeacherListRes = createApiResponseSchema(
	createPaginatedResponseSchema(TeacherSchema)
);
export type TeacherListResType = z.infer<typeof TeacherListRes>;

export const CreateTeacherBody = z.object({
	id: z.number().optional(),
	teacherId: z.number().optional(),
	TeacherId: z.number().optional(),
	userId: z.number().optional(),
	accountId: z.number().optional(),
	AccountId: z.number().optional(),
	schoolId: z.number({ required_error: 'Vui lòng chọn trường học' }).optional(),
	SchoolId: z.number().optional(),
	fullname: z.string().optional(),
	Fullname: z.string().optional(),
	dateOfBirth: z.union([z.string(), z.date()]).nullable().optional(),
	DateOfBirth: z.union([z.string(), z.date()]).nullable().optional(),
	gender: z.boolean().optional(),
	Gender: z.boolean().optional(),
	address: z.string().nullable().optional(),
	Address: z.string().nullable().optional(),
	status: z.boolean().optional(),
	Status: z.boolean().optional(),
	photoPath: z.any().nullable().optional(),
	PhotoPath: z.any().nullable().optional(),
	dateCreate: z.union([z.string(), z.date()]).nullable().optional(),
	DateCreate: z.union([z.string(), z.date()]).nullable().optional(),
	dateUpdate: z.union([z.string(), z.date()]).nullable().optional(),
	DateUpdate: z.union([z.string(), z.date()]).nullable().optional(),
});
export type CreateTeacherBodyType = z.infer<typeof CreateTeacherBody>;

export const UpdateTeacherBody = CreateTeacherBody;
export type UpdateTeacherBodyType = CreateTeacherBodyType;

export const TeacherParams = z.object({
	accountId: z.coerce.number().optional(),
	userId: z.coerce.number().optional(),
});
export type TeacherParamsType = z.infer<typeof TeacherParams>;
