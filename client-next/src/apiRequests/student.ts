import http from '@/lib/http';
import { MessageResType } from '@/schemaValidations/common.schema';
import {
	CreateStudentBodyType,
	StudentResType,
	UpdateStudentBodyType,
} from '@/schemaValidations/student.schema';
import { QueryType } from '@/types/queryType';

export const studentApiRequest = {
	students: (queryObject: QueryType, schoolId?: number | null) => {
		const query = schoolId
			? `pageNumber=${queryObject.pageNumber}&pageSize=${queryObject.pageSize}&schoolId=${schoolId}`
			: `pageNumber=${queryObject.pageNumber}&pageSize=${queryObject.pageSize}`;
		return http.get<StudentResType>(`/Students?${query}`);
	},

	student: (id: number, token?: string) =>
		http.get<StudentResType>(`/Students/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}),

	studentsByClass: (schoolId: number, classId: number) =>
		http.get<StudentResType>(
			`/Students/get-student-by-class?schoolId=${schoolId}&classId=${classId}`
		),

	create: (body: CreateStudentBodyType) =>
		http.post<MessageResType>('/Students', body),

	update: (id: number, body: UpdateStudentBodyType) =>
		http.put<MessageResType>(`/Students/${id}`, body),

	delete: (id: number) => http.delete<MessageResType>(`/Students/${id}`),

	bulkdelete: (ids: number[]) =>
		http.delete<MessageResType>('/Students/bulk-delete', ids),

	upload: (file: FormData) =>
		http.post<MessageResType>('/Students/upload', file),
};
