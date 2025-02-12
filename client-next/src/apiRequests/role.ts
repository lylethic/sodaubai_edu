import http from '@/lib/http';
import { MessageResType } from '@/schemaValidations/common.schema';
import {
	CreateRoleBodyType,
	RoleAddResType,
	RoleResType,
	UpdateRoleBodyType,
} from '@/schemaValidations/role.schema';
import { cache } from 'react';

const roleApiRequest = {
	getRoles: (pageNumber: number, pageSize: number) =>
		http.get<RoleResType>(
			`/Roles?pageNumber=${pageNumber}&pageSize=${pageSize}`
		),

	getRoleNoPagination: () =>
		http.get<RoleResType>(`/Roles/get-roles-no-pagination`),

	getRole: (id: number) => http.get(`/Role/${id}`),

	countNumberOfRoles: () =>
		http.get<number | null>('/Roles/count-number-of-roles'),

	addRole: (body: CreateRoleBodyType) =>
		http.post<RoleAddResType>('/Roles', body),

	updateRole: (id: number, body: UpdateRoleBodyType) =>
		http.put<RoleAddResType>(`/Roles/${id}`, body),

	deleteRole: (id: number) => http.delete<MessageResType>(`/Roles/${id}`),

	bulkDeleteRole: (ids: number[]) =>
		http.delete<MessageResType>(`/Roles/bulkdelete?ids=${ids.join(',')}`),

	importExcel: (body: FormData) =>
		http.post<{
			message: string;
			data: File;
		}>('/Roles/import-excel', body),

	uploadImage: (body: FormData) =>
		http.post<{
			message: string;
			data: string;
		}>('/Roles/upload', body),

	exportExcelRoles: (ids: number[]) =>
		http.post<MessageResType>(`/Roles/export?ids=${ids.join(',')}`, {}),
};

export default roleApiRequest;
