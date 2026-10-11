import z from 'zod';

export const RegisterBody = z
	.object({
		name: z.string().trim().min(2).max(256),
		email: z.string().email(),
		password: z.string().min(6).max(100),
		confirmPassword: z.string().min(6).max(100),
	})
	.strict()
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'Mật khẩu không khớp',
				path: ['confirmPassword'],
			});
		}
	});

export type RegisterBodyType = z.TypeOf<typeof RegisterBody>;

export const RegisterRes = z.object({
	isSuccess: z.boolean(),
	message: z.string(),
	data: z.object({
		token: z.string(),
		expiresAt: z.string(),
	}),
});

export type RegisterResType = z.TypeOf<typeof RegisterRes>;

export const LoginBody = z
	.object({
		Email: z.string().email(),
		Password: z.string().min(6).max(100),
	})
	.strict();

export type LoginBodyType = z.TypeOf<typeof LoginBody>;
export type LoginResType = z.TypeOf<typeof RegisterRes>;

export const SlideSessionBody = z.object({}).strict();
export type SlideSessionBodyType = z.TypeOf<typeof SlideSessionBody>;

export const SlideSessionRes = RegisterRes;
export type SlideSessionResType = z.TypeOf<typeof SlideSessionRes>;

export const MyInfoSchema = z.object({
	id: z.number(),
	email: z.string().email(),
	username: z.string().nullable().optional(),
	avatar: z.string().nullable().optional(),
	schoolId: z.number().nullable().optional(),
	schoolName: z.string().nullable().optional(),
	teacherId: z.number().nullable().optional(),
	fullname: z.string().nullable().optional(),
	dateOfBirth: z.union([z.string(), z.date()]).nullable().optional(),
	gender: z.boolean().nullable().optional(),
	address: z.string().nullable().optional(),
	photoPath: z.string().nullable().optional(),
	status: z.boolean().nullable().optional(),
});

export type MyInfoDto = z.infer<typeof MyInfoSchema>;

export const MyInfoRes = z.object({
	isSuccess: z.boolean(),
	statusCode: z.number(),
	message: z.string(),
	data: MyInfoSchema.nullable(),
});

export type MyInfoResType = z.infer<typeof MyInfoRes>;

