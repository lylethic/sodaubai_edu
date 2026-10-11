import { z } from 'zod';
import {
	createApiResponseSchema,
	createPaginatedResponseSchema,
} from './common.schema';

export const UserSchema = z.object({
	id: z.number(),
	accountId: z.number().optional(),
	schoolId: z.number().nullable().optional(),
	email: z.string().email(),
	username: z.string().nullable().optional(),
	avatar: z.string().nullable().optional(),
	fullName: z.string().nullable().optional(),
	teacherId: z.number().nullable().optional(),
	roleId: z.number().nullable().optional(),
	statusTeacher: z.boolean().nullable().optional(),
	dateCreated: z.union([z.string(), z.date()]).nullable().optional(),
	dateUpdated: z.union([z.string(), z.date()]).nullable().optional(),
});

export type UserDto = z.infer<typeof UserSchema>;
export const AccountSchema = UserSchema;
export type AccountSchemaType = z.infer<typeof AccountSchema>;

export const AccountRes = createApiResponseSchema(UserSchema);
export type AccountResType = z.infer<typeof AccountRes>;

export const AccountDetailRes = AccountRes;
export type AccountDetailResType = AccountResType;

export const AccountListRes = createApiResponseSchema(
	createPaginatedResponseSchema(UserSchema)
);
export type AccountListResType = z.infer<typeof AccountListRes>;

export const CreateAccountBody = z.object({
	schoolId: z.number({ required_error: 'Vui lòng chọn trường' }),
	email: z
		.string({ required_error: 'Email is required' })
		.email('Invalid email format'),
	username: z.string().optional(),
	avatar: z.string().optional(),
	password: z.string().min(6).max(100).optional(),
	passwordHash: z.string().min(6).max(100).optional(),
	roleId: z.number().optional(),
	RoleId: z.number().optional(),
	SchoolId: z.number().optional(),
	Email: z.string().email().optional(),
	Password: z.string().optional(),
});

export type CreateAccountBodyType = z.infer<typeof CreateAccountBody>;

export const UpdateAccountBody = z.object({
	id: z.number().optional(),
	schoolId: z.number().nullable().optional(),
	email: z.string().email().optional(),
	username: z.string().nullable().optional(),
	avatar: z.string().nullable().optional(),
	roleId: z.number().nullable().optional(),
	dateCreated: z.union([z.string(), z.date()]).nullable().optional(),
	dateUpdated: z.union([z.string(), z.date()]).nullable().optional(),
});

export type UpdateAccountBodyType = z.infer<typeof UpdateAccountBody>;

export const AccountAddRes = AccountRes;
export type AccountAddResType = AccountResType;

export const UpdateAccountRes = AccountRes;
export type UpdateAccountResType = AccountResType;

export const AccountParams = z.object({
	id: z.coerce.number(),
	schoolId: z.coerce.number().optional(),
	roleId: z.coerce.number().optional(),
	accountId: z.coerce.number().optional(),
});

export const UpdateMeBody = z.object({
	email: z.string().trim().min(2).max(100),
});

export type UpdateMeBodyType = z.infer<typeof UpdateMeBody>;
