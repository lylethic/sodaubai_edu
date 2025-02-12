import http from '@/lib/http';
import {
	AccountDetailResType,
	AccountAddResType,
	AccountResType,
	CreateAccountBodyType,
	UpdateAccountBodyType,
} from '@/schemaValidations/account.schema';
import { MessageResType } from '@/schemaValidations/common.schema';

const accountApiRequest = {
	// lay dc token, ko lay duoc trong cookie (lay trong handler)
	accounts: (
		pageNumber: number,
		pageSize: number,
		schoolId?: number | null
	) => {
		const queryOptions = !schoolId
			? `pageNumber=${pageNumber}&pageSize=${pageSize}`
			: `pageNumber=${pageNumber}&pageSize=${pageSize}&schoolId=${schoolId}`;

		return http.get<AccountResType>(`/Accounts?${queryOptions}`, {
			cache: 'no-store',
		});
	},

	getAccountsBySchool: (
		idSchool: number | null,
		pageNumber?: number,
		pageSize?: number
	) =>
		http.get<AccountResType>(
			`/Accounts/get-accounts-by-school?schoolId=${idSchool}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
			{ cache: 'no-store' }
		),

	accountsSelect: () => http.get<AccountResType>(`/Accounts`),

	accountsServer: (pageNumber: number, pageSize: number, token: string) =>
		http.get<AccountResType>(
			`/Accounts?pageNumber=${pageNumber}&pageSize=${pageSize}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
				cache: 'no-store',
			}
		),

	getDetail: (id: number, token: string) =>
		http.get<AccountResType>(`/Accounts/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			cache: 'no-store',
		}),

	getAccountById: (id: number, token: string) =>
		http.get<AccountResType>(`/Accounts/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			cache: 'no-store',
		}),

	getAccountHasName: (id: number, token: string) =>
		http.get<AccountDetailResType>(`/Accounts/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}),

	// get-accounts-by-role?PageNumber=1&PageSize=20&roleId=1&schoolId=1
	accountsByRoleIdSchoolId: (
		roleId: number | null,
		schoolId?: number | null,
		pageNumber?: number | null,
		pageSize?: number | null
	) => {
		const queryOptions = new URLSearchParams();

		if (pageNumber != null)
			queryOptions.append('pageNumber', pageNumber.toString());

		if (pageSize != null) queryOptions.append('pageSize', pageSize.toString());

		if (roleId !== null && roleId !== undefined) {
			queryOptions.append('roleId', roleId.toString());
		}

		if (schoolId !== null && schoolId !== undefined) {
			queryOptions.append('schoolId', schoolId.toString());
		}
		return http.get<AccountResType>(
			`/Accounts/get-accounts-by-role?${queryOptions.toString()}`
		);
	},

	countNumberOfAccounts: () =>
		http.get<number | null>('/Accounts/count-number-of-accounts', {
			cache: 'no-store',
		}),

	countNumberOfAccountsBySchool: (id: number) =>
		http.get<number | null>(
			`/Accounts/count-number-of-accounts-by-school?id=${id}`,
			{
				cache: 'no-store',
			}
		),

	addAccount: (body: CreateAccountBodyType) =>
		http.post<AccountAddResType>('/Accounts', body),

	updateAccount: (id: number, body: UpdateAccountBodyType) =>
		http.put<AccountAddResType>(`/Accounts/${id}`, body),

	deleteAccount: (id: number) => http.delete<MessageResType>(`/Accounts/${id}`),

	bulkDeleteAccount: (ids: number[]) =>
		http.delete<MessageResType>(`/Accounts/bulkdelete`, ids),

	importExcel: (formData: FormData) =>
		http.post<MessageResType>(`/Accounts/upload`, formData),

	relativeSearchAccounts: (
		pageNumber: number,
		pageSize: number,
		schoolId?: number,
		name?: string
	) => {
		const params = new URLSearchParams({
			...(schoolId && { schoolId: schoolId.toString() }),
			...(name && { name: name }),
			pageNumber: pageNumber.toString(),
			pageSize: pageSize.toString(),
		}).toString();

		return http.get<AccountResType>(`/Accounts/search?${params.toString()}`, {
			cache: 'no-store',
		});
	},
};

export default accountApiRequest;
