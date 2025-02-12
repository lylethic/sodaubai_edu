import http from '@/lib/http';
import {
	AcademicYearIdResType,
	AcademicYearResType,
	CreateNamHocBodyType,
	UpdateNamHocBodyType,
} from '@/schemaValidations/academicYear.schema';
import { MessageResType } from '@/schemaValidations/common.schema';
import { QueryType } from '@/types/queryType';

export const namHocApiRequest = {
	namHocs: (query: QueryType) =>
		http.get<AcademicYearResType>(
			`/AcademicYears?pageNumber=${query.pageNumber}&pageSize=${query.pageSize}`,
			{
				cache: 'no-store',
			}
		),

	namHocsNoPagination: () =>
		http.get<AcademicYearResType>('/AcademicYears', {
			cache: 'no-store',
		}),

	listNamHocs: () =>
		http.get<AcademicYearResType>(`/AcademicYears`, {
			cache: 'no-store',
		}),

	namHoc: (id: number) => http.get<AcademicYearResType>(`/AcademicYears/${id}`),

	namHocDetail: (id: number, token?: string) =>
		http.get<AcademicYearIdResType>(`/AcademicYears/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			cache: 'no-store',
		}),

	create: (body: CreateNamHocBodyType) =>
		http.post<AcademicYearResType>(`/AcademicYears`, body),

	update: (id: number, body: UpdateNamHocBodyType) =>
		http.put<MessageResType>(`/AcademicYears/${id}`, body),

	delete: (id: number) => http.delete<MessageResType>(`/AcademicYears/${id}`),

	bulkdelete: (ids: number[]) =>
		http.delete<MessageResType>('/AcademicYears/bulkdelete', ids),

	importExcelFile: (body: FormData) => {
		return http.post<MessageResType>(`/AcademicYears/upload`, body);
	},
};
