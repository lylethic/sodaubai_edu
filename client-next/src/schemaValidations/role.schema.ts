import { z } from 'zod';

const RoleRes = z
	.object({
		status: z.number(),
		message: z.string(),
		data: z.object({
			roleId: z.number(),
			nameRole: z.string({
				required_error: 'Vui lòng nhập tên cho vai trò này',
			}),
			description: z.string().optional(),
			dateCreated: z.date().nullable().optional(),
			dateUpdated: z.date().nullable().optional(),
		}),
	})
	.strict();

export type RoleResType = z.TypeOf<typeof RoleRes>;

export const CreateRoleBody = z.object({
	NameRole: z.string({
		required_error: 'Vui lòng nhập tên cho vai trò này',
	}),
	Description: z.string().optional(),
});

export type CreateRoleBodyType = z.TypeOf<typeof CreateRoleBody>;

export const RoleSchema = z.object({
	roleId: z.number(),
	nameRole: z.string({
		required_error: 'Vui lòng nhập tên cho vai trò này',
	}),
	description: z.string().optional(),
	dateCreated: z.date().nullable().optional(),
	dateUpdated: z.date().nullable().optional(),
});

export const RoleAddRes = z.object({
	message: z.string(),
	data: RoleSchema,
});

export type RoleAddResType = z.TypeOf<typeof RoleAddRes>;

export const RoleListRes = z.object({
	message: z.string(),
	data: z.array(RoleSchema),
});

export type RoleListResType = z.TypeOf<typeof RoleListRes>;

export const UpdateRoleBody = CreateRoleBody;
export type UpdateRoleBodyType = z.TypeOf<typeof UpdateRoleBody>;

export const RoleParams = z.object({
	roleId: z.coerce.number(),
});
