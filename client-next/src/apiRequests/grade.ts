import http from '@/lib/http';
import { MessageResType } from '@/schemaValidations/common.schema';
import {
	CreateGradeBodyType,
	GradeDetailResType,
	GradeResType,
	UpdateGradeBodyType,
} from '@/schemaValidations/grade.schema';
import { QueryType } from '@/types/queryType';

export const gradeApiRequest = {
	grades: (queryObject: QueryType) =>
		http.get<GradeResType>(
			`/Grades?pageNumber=${queryObject.pageNumber}&pageSize=${queryObject.pageSize}`
		),

	grade: (id: number, token?: string) =>
		http.get<GradeResType>(`/Grades/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}),

	create: (body: CreateGradeBodyType) =>
		http.post<GradeResType>('/Grades', body),

	delete: (id: number) => http.delete<MessageResType>(`/Grades/${id}`),

	update: (id: number, body: UpdateGradeBodyType) =>
		http.put<MessageResType>(`/Grades/${id}`, body),

	bulkdelete: (ids: number[]) =>
		http.delete<MessageResType>('/Grades/bulk-delete', ids),

	upload: (file: FormData) => http.post<MessageResType>('/Grades/upload', file),
};
