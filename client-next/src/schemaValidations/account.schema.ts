import { z } from 'zod';

export const AccountRes = z
	.object({
		message: z.string(),
		data: z.object({
			accountId: z.number().int(),
			roleId: z.number(),
			schoolId: z.number(),
			email: z
				.string({ required_error: 'Email is required' })
				.email('Invalid email format'),
			dateCreated: z.date().nullable().optional(),
			dateUpdated: z.date().nullable().optional(),
		}),
		pagination: z.object({
			pageNumber: z.number(),
			pageSize: z.number(),
			totalResults: z.number(),
			totalPages: z.number(),
		}),
	})
	.strict();

export type AccountResType = z.TypeOf<typeof AccountRes>;

const AccountDetailRes = z
	.object({
		message: z.string(),
		data: z.object({
			accountId: z.number(),
			roleId: z.number(),
			schoolId: z.number(),
			email: z
				.string({ required_error: 'Email is required' })
				.email('Invalid email format'),
			teacherId: z.number(),
			fullName: z.string(),
			statusTeacher: z.boolean(),
		}),
		pagination: z.object({
			pageNumber: z.number(),
			pageSize: z.number(),
			totalResults: z.number(),
			totalPages: z.number(),
		}),
	})
	.strict();

export type AccountDetailResType = z.TypeOf<typeof AccountDetailRes>;

export const CreateAccountBody = z.object({
	RoleId: z.number(),
	SchoolId: z.number(),
	Email: z
		.string({ required_error: 'Email is required' })
		.email('Invalid email format'),
	Password: z.string().min(6).max(100),
});

export type CreateAccountBodyType = z.TypeOf<typeof CreateAccountBody>;

export const AccountSchema = z.object({
	accountId: z.number(),
	roleId: z.number(),
	schoolId: z.number(),
	email: z
		.string({ required_error: 'Email is required' })
		.email('Invalid email format'),
	password: z.string().min(6).max(100).optional(),
	dateCreated: z.date().nullable().optional(),
	dateUpdated: z.date().nullable().optional(),
});

export const AccountAddRes = z.object({
	message: z.string(),
	data: AccountSchema,
});

export type AccountAddResType = z.TypeOf<typeof AccountAddRes>;

export const AccountListRes = z.object({
	message: z.string(),
	data: z.array(AccountSchema),
});

export type AccountListResType = z.TypeOf<typeof AccountListRes>;

export const UpdateAccountBody = z.object({
	roleId: z.number(),
	schoolId: z.number(),
	email: z.string(),
	dateCreated: z.date().nullable().optional(),
	dateUpdated: z.date().nullable().optional(),
});
export type UpdateAccountBodyType = z.TypeOf<typeof UpdateAccountBody>;

export const UpdateAccountRes = z.object({
	message: z.string(),
	data: UpdateAccountBody,
});

export type UpdateAccountResType = z.TypeOf<typeof UpdateAccountRes>;

export const AccountParams = z.object({
	id: z.coerce.number(),
	schoolId: z.coerce.number(),
	roleId: z.coerce.number(),
	accountId: z.coerce.number(),
});

export const UpdateMeBody = z.object({
	email: z.string().trim().min(2).max(100),
});

export type UpdateMeBodyType = z.TypeOf<typeof UpdateMeBody>;
