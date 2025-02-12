import http from '@/lib/http';
import { MessageResType } from '@/schemaValidations/common.schema';
import {
	CreateLopHocBodyType,
	LopHocResDetailsToUpdateType,
	LopHocResType,
	UpdateLopHocBodyType,
} from '@/schemaValidations/lopHoc.shema';
import { QueryType } from '@/types/queryType';

export const lopHocApiRequest = {
	classes: (query: QueryType) =>
		http.get<LopHocResType>(
			`/Classes?pageNumber=${query.pageNumber}&pageSize=${query.pageSize}`,
			{ cache: 'no-store' }
		),

	class: (id: number, token: string) =>
		http.get<LopHocResType>(`/Classes/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
				cache: 'no-store',
			},
		}),

	getDetail: (id: number, token: string) =>
		http.get<LopHocResDetailsToUpdateType>(`/Classes/get-detail/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
				cache: 'no-store',
			},
		}),

	getLopHocBySchool: (query: QueryType, schoolId: number | null) =>
		http.get<LopHocResType>(
			`/Classes/get-class-by-school?schoolId=${schoolId}&pageNumber=${query.pageNumber}&pageSize=${query.pageSize}`,
			{ cache: 'no-store' }
		),

	getLopHocBySchoolNoLimit: (schoolId: number | null) =>
		http.get<LopHocResType>(
			`/Classes/get-class-by-school-no-limit?schoolId=${schoolId}`,
			{ cache: 'no-store' }
		),

	lopChuNhiem: (id: number) =>
		http.get<LopHocResType>(`Classes/lop-chu-nhiem/${id}`, {
			cache: 'no-store',
		}),

	create: (body: CreateLopHocBodyType) =>
		http.post<LopHocResType>('/Classes', body),

	update: (id: number, body: UpdateLopHocBodyType) =>
		http.put<MessageResType>(`/Classes/${id}`, body),

	delete: (id: number) => http.delete<MessageResType>(`/Classes/${id}`),

	bulkdelete: (ids: number[]) =>
		http.delete<MessageResType>('/Classes/bulkdelete', ids),

	upload: (formData: FormData) =>
		http.post<MessageResType>('/Classes/upload', formData),
};
