import http from '@/lib/http';
import { MessageResType } from '@/schemaValidations/common.schema';
import {
	CreateSemesterBodyType,
	SemesterListResType,
	SemesterResType,
	UpdateSemesterBodyType,
} from '@/schemaValidations/semester.schema';
import { ApiResponse, buildQueryString, QueryObject } from '@/types/api';
import { QueryType } from '@/types/queryType';

export const semesterApiRequest = {
	semesters: (query: QueryType, token?: string) =>
		http.get<SemesterListResType>(
			`/v1/semesters${buildQueryString(query as QueryObject)}`,
			{
				token,
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				cache: 'no-store',
			}
		),

	semestersNoPagination: (token?: string) =>
		http.get<SemesterListResType>(
			'/v1/semesters?pageNumber=1&pageSize=1000',
			{
				token,
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				cache: 'no-store',
			}
		),

	semester: (id: number, token?: string) =>
		http.get<SemesterResType>(`/v1/semesters/${id}`, {
			token,
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
			cache: 'no-store',
		}),

	create: (body: CreateSemesterBodyType) => {
		const payload = {
			academicYearId: body.academicYearId,
			semesterName: body.semesterName,
			dateStart: body.dateStart ? new Date(body.dateStart).toISOString() : null,
			dateEnd: body.dateEnd ? new Date(body.dateEnd).toISOString() : null,
			description: body.description || '',
			status: body.status,
		};
		return http.post<SemesterResType>('/v1/semesters', payload);
	},

	update: (id: number, body: UpdateSemesterBodyType) => {
		const payload = {
			semesterId: id,
			academicYearId: body.academicYearId,
			semesterName: body.semesterName,
			dateStart: body.dateStart ? new Date(body.dateStart).toISOString() : null,
			dateEnd: body.dateEnd ? new Date(body.dateEnd).toISOString() : null,
			description: body.description || '',
			status: body.status,
		};
		return http.put<SemesterResType>(`/v1/semesters/${id}`, payload);
	},

	delete: (id: number) =>
		http.delete<ApiResponse<boolean>>(`/v1/semesters/${id}`),

	bulkdelete: (ids: number[]) =>
		http.delete<ApiResponse<boolean>>('/v1/semesters/bulk-delete', ids),

	upload: (file: FormData) =>
		http.post<MessageResType>('/v1/semesters/upload', file),
};

export default semesterApiRequest;
