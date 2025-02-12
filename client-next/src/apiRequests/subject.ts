import http from '@/lib/http';
import { MessageResType } from '@/schemaValidations/common.schema';
import {
	CreateSubjectBodyType,
	SubjectResType,
	UpdateSubjectBodyType,
} from '@/schemaValidations/subject.schema';

import { QueryType } from '@/types/queryType';

export const subjectApiRequest = {
	subjects: (queryObject: QueryType) =>
		http.get<SubjectResType>(
			`/Subjects?pageNumber=${queryObject.pageNumber}&pageSize=${queryObject.pageSize}`
		),

	subjectsNoPagination: () => http.get<SubjectResType>('/Subjects'),

	subject: (id: number, token?: string) =>
		http.get<SubjectResType>(`/Subjects/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}),

	create: (body: CreateSubjectBodyType) =>
		http.post<MessageResType>('/Subjects', body),

	update: (id: number, body: UpdateSubjectBodyType) =>
		http.put<MessageResType>(`/Subjects/${id}`, body),

	delete: (id: number) => http.delete<MessageResType>(`/Subjects/${id}`),

	bulkdelete: (ids: number[]) =>
		http.delete<MessageResType>('/Subjects/bulk-delete', ids),

	upload: (file: FormData) =>
		http.post<MessageResType>('/Subjects/upload', file),
};
