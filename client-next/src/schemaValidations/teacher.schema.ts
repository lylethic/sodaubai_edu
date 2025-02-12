import { z } from 'zod';

export const TeacherSchema = z.object({
	message: z.string(),
	data: z.object({
		teacherId: z.number(),
		accountId: z.number(),
		schoolId: z.number(),
		fullname: z.string(),
		dateOfBirth: z.date(),
		gender: z.boolean(),
		address: z.string(),
		status: z.boolean(),
		dateCreate: z.date().nullable().optional(),
		dateUpdate: z.date().nullable().optional(),
		photoPath: z.instanceof(File).nullable().optional(),
	}),
});
export type TeacherDetailResType = z.TypeOf<typeof TeacherSchema>;

export const TeacherRes = z.object({
	message: z.string(),
	totalResults: z.number().nullable(),
	data: z.object({
		teacherId: z.number(),
		accountId: z.number(),
		schoolId: z.number(),
		fullname: z.string(),
		dateOfBirth: z.string(),
		gender: z.boolean(),
		address: z.string(),
		status: z.boolean(),
		dateCreate: z.string().nullable().optional(),
		dateUpdate: z.string().nullable().optional(),
		nameSchool: z.string().nullable(),
		schoolType: z.boolean(),
		photoPath: z.string().nullable(),
	}),
	pagination: z.object({
		pageNumber: z.number(),
		pageSize: z.number(),
		totalResults: z.number(),
		totalPages: z.number(),
	}),
});
export type TeacherResType = z.TypeOf<typeof TeacherRes>;

export const CreateTeacherBody = z.object({
	TeacherId: z.number(),
	AccountId: z.number(),
	SchoolId: z.number(),
	Fullname: z.string(),
	DateOfBirth: z.date().max(new Date(), 'DateOfBirth cannot be in the future'),
	Gender: z.boolean(),
	Address: z.string(),
	Status: z.boolean(),
	DateCreate: z.date().nullable().optional(),
	DateUpdate: z.date().nullable().optional(),
	PhotoPath: z.instanceof(File).nullable().optional(),
});
export type CreateTeacherBodyType = z.TypeOf<typeof CreateTeacherBody>;

export const TeacherListRes = z.object({
	message: z.string(),
	data: TeacherSchema,
});

export type TeacherListResType = z.TypeOf<typeof TeacherListRes>;

export const UpdateTeacherBody = z.object({
	teacherId: z.number(),
	accountId: z.number(),
	schoolId: z.number(),
	fullname: z.string(),
	dateOfBirth: z.preprocess(
		(val) => (typeof val === 'string' ? new Date(val) : val),
		z.date()
	),
	gender: z.boolean(),
	address: z.string(),
	status: z.boolean(),
	dateCreate: z
		.union([z.string(), z.date()]) // method accept multiple types
		.transform((value) => (value ? new Date(value) : null))
		.nullable()
		.optional(),
	dateUpdate: z
		.union([z.string(), z.date()]) // method accept multiple types
		.transform((value) => (value ? new Date(value) : null))
		.nullable()
		.optional(),
	photoPath: z.instanceof(File).nullable().optional(),
});
export type UpdateTeacherBodyType = z.infer<typeof UpdateTeacherBody>;

export const TeacherParams = z.object({
	accountId: z.coerce.number(),
});
export type TeacherParamsType = z.TypeOf<typeof TeacherParams>;
