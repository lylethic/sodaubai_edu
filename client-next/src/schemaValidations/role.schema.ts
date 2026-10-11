import { z } from 'zod';
import {
	createApiResponseSchema,
	createPaginatedResponseSchema,
} from './common.schema';

export const RoleSchema = z.object({
	id: z.number().optional(),
	roleId: z.number().optional(),
	nameRole: z.string({
		required_error: 'Vui lòng nhập tên cho vai trò này',
	}),
	description: z.string().nullable().optional(),
	dateCreated: z.union([z.string(), z.date()]).nullable().optional(),
	dateUpdated: z.union([z.string(), z.date()]).nullable().optional(),
});

export type RoleDto = z.infer<typeof RoleSchema>;

export const RoleRes = createApiResponseSchema(RoleSchema);
export type RoleResType = z.infer<typeof RoleRes>;

export const RoleListRes = createApiResponseSchema(
	createPaginatedResponseSchema(RoleSchema)
);
export type RoleListResType = z.infer<typeof RoleListRes>;

export const CreateRoleBody = z.object({
	nameRole: z.string({
		required_error: 'Vui lòng nhập tên cho vai trò này',
	}),
	description: z.string().optional(),
	NameRole: z.string().optional(),
	Description: z.string().optional(),
});

export type CreateRoleBodyType = z.infer<typeof CreateRoleBody>;

export const RoleAddRes = RoleRes;
export type RoleAddResType = RoleResType;

export const UpdateRoleBody = CreateRoleBody;
export type UpdateRoleBodyType = z.infer<typeof UpdateRoleBody>;

export const RoleParams = z.object({
	id: z.coerce.number().optional(),
	roleId: z.coerce.number().optional(),
});
