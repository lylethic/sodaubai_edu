import http from '@/lib/http';
import { MessageResType } from '@/schemaValidations/common.schema';
import {
	CreatePhanCongDayMonHocBodyType,
	PhanCongDayMonHocResType,
	SubjectAssgmSchemaType,
	UpdatePhanCongDayMonHocBodyType,
} from '@/schemaValidations/phanCongMonDay.schema';
import { QueryType } from '@/types/queryType';

export const PhanCongMonHocApiRequest = {
	create: (body: CreatePhanCongDayMonHocBodyType) =>
		http.post<SubjectAssgmSchemaType>('/SubjectAssmgts', body),

	delete: (id: number) => http.delete<MessageResType>(`/SubjectAssmgts/${id}`),

	bulkdelete: (ids: number[]) =>
		http.delete<MessageResType>('/SubjectAssmgts/bulkdelete', ids),

	detail: (id: number, token: string) =>
		http.get<PhanCongDayMonHocResType>(`/SubjectAssmgts/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			cache: 'no-store',
		}),

	subjectAssigments: (query: QueryType) =>
		http.get<PhanCongDayMonHocResType>(
			`/SubjectAssmgts?pageNumber=${query.pageNumber}&pageSize=${query.pageSize}`,
			{
				cache: 'no-store',
			}
		),

	teacherBySubjectAssign: (id: number) =>
		http.get<PhanCongDayMonHocResType>(
			`/SubjectAssmgts/teacher-by-subject-assign/${id}`,
			{
				cache: 'no-store',
			}
		),

	getToUpdate: (id: number) =>
		http.get<SubjectAssgmSchemaType>(`/SubjectAssmgts/${id}`),

	update: (id: number, body: UpdatePhanCongDayMonHocBodyType) =>
		http.put<MessageResType>(`/SubjectAssmgts/${id}`, body),

	upload: (formData: FormData) =>
		http.post<MessageResType>('/SubjectAssmgts/upload', formData),
};
