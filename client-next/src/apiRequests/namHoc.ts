import http from '@/lib/http';
import {
	AcademicYearIdResType,
	AcademicYearListResType,
	AcademicYearResType,
	CreateNamHocBodyType,
	UpdateNamHocBodyType,
} from '@/schemaValidations/academicYear.schema';
import { MessageResType } from '@/schemaValidations/common.schema';
import { ApiResponse, buildQueryString, QueryObject } from '@/types/api';
import { QueryType } from '@/types/queryType';

export const namHocApiRequest = {
	namHocs: (query: QueryType, token?: string) =>
		http.get<AcademicYearListResType>(
			`/v1/academic-years${buildQueryString(query as QueryObject)}`,
			{
				token,
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				cache: 'no-store',
			}
		),

	namHocsNoPagination: (token?: string) =>
		http.get<AcademicYearListResType>(
			'/v1/academic-years?pageNumber=1&pageSize=1000',
			{
				token,
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				cache: 'no-store',
			}
		),

	listNamHocs: (token?: string) =>
		http.get<AcademicYearListResType>(
			'/v1/academic-years?pageNumber=1&pageSize=1000',
			{
				token,
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				cache: 'no-store',
			}
		),

	namHoc: (id: number, token?: string) =>
		http.get<AcademicYearResType>(`/v1/academic-years/${id}`, {
			token,
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
			cache: 'no-store',
		}),

	namHocDetail: (id: number, token?: string) =>
		http.get<AcademicYearIdResType>(`/v1/academic-years/${id}`, {
			token,
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
			cache: 'no-store',
		}),

	create: (body: CreateNamHocBodyType) => {
		const payload = {
			name: body.name || body.displayAcademicYearName || '',
			yearStart: body.yearStart ? new Date(body.yearStart).toISOString() : null,
			yearEnd: body.yearEnd ? new Date(body.yearEnd).toISOString() : null,
			description: body.description || '',
			status: body.status,
		};
		return http.post<AcademicYearResType>('/v1/academic-years', payload);
	},

	update: (id: number, body: UpdateNamHocBodyType) => {
		const payload = {
			id,
			name: body.name || body.displayAcademicYearName || '',
			yearStart: body.yearStart ? new Date(body.yearStart).toISOString() : null,
			yearEnd: body.yearEnd ? new Date(body.yearEnd).toISOString() : null,
			description: body.description || '',
			status: body.status,
		};
		return http.put<AcademicYearResType>(`/v1/academic-years/${id}`, payload);
	},

	delete: (id: number) =>
		http.delete<ApiResponse<boolean>>(`/v1/academic-years/${id}`),

	bulkdelete: (ids: number[]) =>
		http.delete<ApiResponse<boolean>>('/v1/academic-years/bulkdelete', ids),

	importExcelFile: (body: FormData) =>
		http.post<MessageResType>('/v1/academic-years/upload', body),
};

export default namHocApiRequest;
