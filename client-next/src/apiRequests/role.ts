import http from '@/lib/http';
import { MessageResType } from '@/schemaValidations/common.schema';
import {
	CreateRoleBodyType,
	RoleAddResType,
	RoleListResType,
	RoleResType,
	UpdateRoleBodyType,
} from '@/schemaValidations/role.schema';
import { ApiResponse, buildQueryString, QueryObject } from '@/types/api';

const roleApiRequest = {
	getRoles: (pageNumber: number = 1, pageSize: number = 20, token?: string) =>
		http.get<RoleListResType>(
			`/v1/roles${buildQueryString({ pageNumber, pageSize })}`,
			{ token, cache: 'no-store' }
		),

	getRoleNoPagination: (token?: string) =>
		http.get<RoleListResType>(`/v1/roles?pageNumber=1&pageSize=100`, {
			token,
			cache: 'no-store',
		}),

	getRole: (id: number, token?: string) =>
		http.get<RoleResType>(`/v1/roles/${id}`, { token, cache: 'no-store' }),

	countNumberOfRoles: (token?: string) =>
		http.get<ApiResponse<number>>('/v1/roles?pageNumber=1&pageSize=1', {
			token,
			cache: 'no-store',
		}),

	addRole: (body: CreateRoleBodyType) => {
		const payload = {
			nameRole: body.nameRole || body.NameRole || '',
			description: body.description || body.Description || null,
		};
		return http.post<RoleAddResType>('/v1/roles', payload);
	},

	updateRole: (id: number, body: UpdateRoleBodyType) => {
		const payload = {
			id,
			nameRole: body.nameRole || body.NameRole || '',
			description: body.description || body.Description || null,
		};
		return http.put<RoleAddResType>(`/v1/roles/${id}`, payload);
	},

	deleteRole: (id: number) =>
		http.delete<ApiResponse<boolean>>(`/v1/roles/${id}`),

	bulkDeleteRole: (ids: number[]) =>
		http.delete<ApiResponse<boolean>>('/v1/roles/bulkdelete', ids),

	importExcel: (body: FormData) =>
		http.post<MessageResType>('/v1/roles/upload', body),

	uploadImage: (body: FormData) =>
		http.post<MessageResType>('/v1/roles/upload', body),

	exportExcelRoles: (ids: number[]) =>
		http.post<Blob>('/v1/roles/export', ids, {
			responseType: 'blob',
		}),
};

export default roleApiRequest;
