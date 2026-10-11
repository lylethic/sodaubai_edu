import http from '@/lib/http';
import {
	AccountDetailResType,
	AccountAddResType,
	AccountResType,
	AccountListResType,
	CreateAccountBodyType,
	UpdateAccountBodyType,
} from '@/schemaValidations/account.schema';
import { MessageResType } from '@/schemaValidations/common.schema';
import { ApiResponse, buildQueryString, QueryObject } from '@/types/api';

const accountApiRequest = {
	/**
	 * Get paginated list of users from /api/v1/user
	 */
	getUsers: (query?: QueryObject & { schoolId?: number | null }, token?: string) =>
		http.get<AccountListResType>(`/v1/user${buildQueryString(query)}`, {
			token,
			cache: 'no-store',
		}),

	/**
	 * Backwards compatible accounts call
	 */
	accounts: (
		pageNumber: number = 1,
		pageSize: number = 20,
		schoolId?: number | null,
		token?: string
	) => {
		const query: Record<string, any> = { pageNumber, pageSize };
		if (schoolId) query.schoolId = schoolId;
		return http.get<AccountListResType>(`/v1/user${buildQueryString(query)}`, {
			token,
			cache: 'no-store',
		});
	},

	getAccountsBySchool: (
		idSchool: number | null,
		pageNumber: number = 1,
		pageSize: number = 20,
		token?: string
	) => {
		const query: Record<string, any> = { pageNumber, pageSize };
		if (idSchool) query.schoolId = idSchool;
		return http.get<AccountListResType>(`/v1/user${buildQueryString(query)}`, {
			token,
			cache: 'no-store',
		});
	},

	accountsSelect: (token?: string) =>
		http.get<AccountListResType>(`/v1/user?pageNumber=1&pageSize=100`, {
			token,
			cache: 'no-store',
		}),

	accountsServer: (pageNumber: number, pageSize: number, token: string) =>
		http.get<AccountListResType>(
			`/v1/user?pageNumber=${pageNumber}&pageSize=${pageSize}`,
			{
				token,
				headers: {
					Authorization: `Bearer ${token}`,
				},
				cache: 'no-store',
			}
		),

	getDetail: (id: number, token?: string) =>
		http.get<AccountResType>(`/v1/user/${id}`, {
			token,
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
			cache: 'no-store',
		}),

	getAccountById: (id: number, token?: string) =>
		http.get<AccountResType>(`/v1/user/${id}`, {
			token,
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
		}),

	getAccountHasName: (id: number, token?: string) =>
		http.get<AccountResType>(`/v1/user/${id}`, {
			token,
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
		}),

	accountsByRoleIdSchoolId: (
		pageNumber: number,
		pageSize: number,
		roleId?: number,
		schoolId?: number,
		token?: string
	) => {
		const query: Record<string, any> = { pageNumber, pageSize };
		if (schoolId) query.schoolId = schoolId;
		return http.get<AccountListResType>(`/v1/user${buildQueryString(query)}`, {
			token,
		});
	},

	countNumberOfAccounts: (token?: string) =>
		http.get<AccountListResType>('/v1/user?pageNumber=1&pageSize=1', {
			token,
			cache: 'no-store',
		}),

	countNumberOfAccountsBySchool: (id: number, token?: string) =>
		http.get<AccountListResType>(
			`/v1/user?schoolId=${id}&pageNumber=1&pageSize=1`,
			{
				token,
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				cache: 'no-store',
			}
		),

	addAccount: (body: CreateAccountBodyType) => {
		const payload = {
			schoolId: body.schoolId || body.SchoolId || 0,
			email: body.email || body.Email || '',
			username: body.username || (body.email || body.Email || '').split('@')[0],
			avatar: body.avatar || null,
			passwordHash: body.password || body.passwordHash || body.Password || '',
		};
		return http.post<AccountAddResType>('/v1/user', payload);
	},

	updateAccount: (id: number, body: UpdateAccountBodyType) =>
		http.put<AccountAddResType>(`/v1/user/${id}`, { id, ...body }),

	deleteAccount: (id: number) =>
		http.delete<ApiResponse<boolean>>(`/v1/user/${id}`),

	bulkDeleteAccount: (ids: number[]) => {
		// Sequentially or parallel delete for endpoints without dedicated bulk
		return Promise.all(ids.map((id) => http.delete<ApiResponse<boolean>>(`/v1/user/${id}`)));
	},

	uploadAvatar: (id: number, file: File) => {
		const formData = new FormData();
		formData.append('id', id.toString());
		formData.append('file', file);
		return http.post<AccountResType>('/v1/user/upload', formData);
	},

	importExcel: (formData: FormData) =>
		http.post<MessageResType>('/v1/user/upload', formData),

	relativeSearchAccounts: (
		pageNumber: number,
		pageSize: number,
		schoolId?: number,
		keyword?: string
	) => {
		const query: Record<string, any> = { pageNumber, pageSize };
		if (schoolId) query.schoolId = schoolId;
		if (keyword) query.keyword = keyword;

		return http.get<AccountListResType>(`/v1/user${buildQueryString(query)}`, {
			cache: 'no-store',
		});
	},
};

export default accountApiRequest;
