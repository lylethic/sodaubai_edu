import http from '@/lib/http';
import { MessageResType } from '@/schemaValidations/common.schema';
import {
	CreateSchoolBodyType,
	SchoolListResType,
	SchoolResType,
	UpdateSchoolBodyType,
} from '@/schemaValidations/school.schema';
import { ApiResponse, buildQueryString, QueryObject } from '@/types/api';

const schoolApiRequest = {
	// Create a new school
	createSchool: (body: CreateSchoolBodyType) => {
		const payload = {
			name: body.name || body.nameSchool || '',
			phoneNumber: body.phoneNumber,
			schoolType: body.schoolType || 'CÔNG LẬP',
			description: body.description || '',
			level: body.level ?? 3,
		};
		return http.post<SchoolResType>('/v1/schools', payload);
	},

	// Get a school by ID
	getSchool: (id: number, token?: string) =>
		http.get<SchoolResType>(`/v1/schools/${id}`, {
			token,
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
			cache: 'no-store',
		}),

	// Get list of schools with pagination & filters
	getSchools: (
		pageNumber: number = 1,
		pageSize: number = 20,
		token?: string,
		queryExtra?: QueryObject
	) => {
		const query = { pageNumber, pageSize, ...queryExtra };
		return http.get<SchoolListResType>(`/v1/schools${buildQueryString(query)}`, {
			token,
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
			cache: 'no-store',
		});
	},

	getNameOfSchool: (id: number, token?: string) =>
		http.get<{ nameSchool: string }>(`/v1/schools/get-name-of-school/${id}`, {
			token,
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
			cache: 'no-store',
		}),

	getSchoolsNoPagination: (token?: string) =>
		http.get<SchoolListResType>('/v1/schools?pageNumber=1&pageSize=1000', {
			token,
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
			cache: 'no-store',
		}),

	// Update a school by ID
	updateSchool: (id: number, body: UpdateSchoolBodyType) => {
		const payload = {
			id,
			name: body.name || body.nameSchool || '',
			phoneNumber: body.phoneNumber,
			schoolType: body.schoolType || 'CÔNG LẬP',
			description: body.description || '',
			level: body.level ?? 3,
		};
		return http.put<SchoolResType>(`/v1/schools/${id}`, payload);
	},

	// Delete a school by ID
	deleteSchool: (id: number) =>
		http.delete<ApiResponse<boolean>>(`/v1/schools/${id}`),

	// Bulk delete schools
	bulkDeleteSchool: (ids: number[]) =>
		http.delete<ApiResponse<boolean>>('/v1/schools/bulkdelete', ids),

	// Import schools from Excel file
	importSchoolsExcel: (file: FormData) =>
		http.post<MessageResType>('/v1/schools/upload', file),

	// Export schools to Excel file download
	exportSchoolsExcel: (ids: number[]) =>
		http.post<Blob>('/v1/schools/export', ids, {
			responseType: 'blob',
		}),
};

export default schoolApiRequest;
