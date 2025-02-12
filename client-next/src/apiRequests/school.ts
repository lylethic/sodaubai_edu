import http from '@/lib/http';
import { MessageResType } from '@/schemaValidations/common.schema';
import {
	CreateSchoolBodyType,
	SchoolResType,
	UpdateSchoolBodyType,
} from '@/schemaValidations/school.schema';

const schoolApiRequest = {
	// Create a new school
	createSchool: (body: CreateSchoolBodyType) =>
		http.post<SchoolResType>('/Schools', body),

	// Get a school by ID
	getSchool: (id: number, token?: string) =>
		http.get<SchoolResType>(`/Schools/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}),

	// Get list of schools with pagination
	getSchools: (pageNumber: number, pageSize: number) =>
		http.get<SchoolResType>(
			`/Schools?pageNumber=${pageNumber}&pageSize=${pageSize}`
		),

	getNameOfSchool: (id: number) =>
		http.get<{ nameSchool: string }>(`/Schools/get-name-of-school/${id}`, {
			cache: 'no-store',
		}),

	getSchoolsNoPagination: () =>
		http.get<SchoolResType>(`/Schools/get-schools-no-pagination`),

	// Update a school by ID
	updateSchool: (id: number, body: UpdateSchoolBodyType) =>
		http.put<SchoolResType>(`/Schools/${id}`, body),

	// Delete a school by ID
	deleteSchool: (id: number) => http.delete<MessageResType>(`/Schools/${id}`),

	// Bulk delete schools
	bulkDeleteSchool: (ids: number[]) =>
		http.delete<MessageResType>(`/Schools/bulkdelete`, ids),

	// Import schools from Excel file
	importSchoolsExcel: (file: FormData) =>
		http.post<MessageResType>('/Schools/upload', file),

	// Export schools to Excel with file path
	exportSchoolsExcel: (ids: number[]) =>
		http.post<MessageResType>(
			`/Schools/export?ids=${ids.join(',')},
			)}`,
			{}
		),
};

export default schoolApiRequest;
