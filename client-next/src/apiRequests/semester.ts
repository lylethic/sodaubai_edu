import http from '@/lib/http';
import { MessageResType } from '@/schemaValidations/common.schema';
import {
	CreateSemesterBodyType,
	SemesterResType,
	UpdateSemesterBodyType,
} from '@/schemaValidations/semester.schema';
import { QueryType } from '@/types/queryType';

export const semesterApiRequest = {
	semesters: (query: QueryType) =>
		http.get<SemesterResType>(
			`/Semesters?pageNumber=${query.pageNumber}&pageSize=${query.pageSize}`
		),

	semester: (id: number, token?: string) =>
		http.get<SemesterResType>(`/Semesters/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}),

	delete: (id: number) => http.delete<MessageResType>(`/Semesters/${id}`),

	bulkdelete: (ids: number[]) =>
		http.delete<MessageResType>(`/Semesters/bulk-delete`, ids),

	create: (body: CreateSemesterBodyType) =>
		http.post<MessageResType>('/Semesters', body),

	update: (id: number, body: UpdateSemesterBodyType) =>
		http.put<MessageResType>(`/Semesters/${id}`, body),

	upload: (file: FormData) =>
		http.post<MessageResType>('/Semesters/upload', file),
};
