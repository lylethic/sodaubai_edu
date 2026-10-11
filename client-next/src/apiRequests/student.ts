import http from '@/lib/http';
import { MessageResType } from '@/schemaValidations/common.schema';
import {
	CreateStudentBodyType,
	StudentArrayResType,
	StudentListResType,
	StudentResType,
	UpdateStudentBodyType,
} from '@/schemaValidations/student.schema';
import { ApiResponse, buildQueryString, QueryObject } from '@/types/api';
import { QueryType } from '@/types/queryType';

export interface StudentQuery extends QueryObject {
	schoolId?: number | null;
	gradeId?: number | null;
	classId?: number | null;
	userId?: number | null;
}

const normalizeStudent = (item: any) => {
	if (!item) return item;
	const id = item.id ?? item.studentId ?? 0;
	const userId = item.userId ?? item.accountId ?? 0;
	return {
		...item,
		id,
		studentId: item.studentId ?? id,
		userId,
		accountId: item.accountId ?? userId,
	};
};

export const studentApiRequest = {
	students: async (
		queryObject: QueryType | StudentQuery,
		schoolId?: number | null,
		token?: string
	) => {
		const query: StudentQuery = {
			...(queryObject as StudentQuery),
		};
		if (schoolId !== undefined && schoolId !== null && schoolId !== 0) {
			query.schoolId = schoolId;
		}
		const res = await http.get<StudentListResType>(
			`/v1/students${buildQueryString(query)}`,
			{
				token,
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				cache: 'no-store',
			}
		);
		if (res.payload?.data?.items) {
			res.payload.data.items = res.payload.data.items.map(normalizeStudent);
		}
		return res;
	},

	student: async (id: number, token?: string) => {
		const res = await http.get<StudentResType>(`/v1/students/${id}`, {
			token,
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
			cache: 'no-store',
		});
		if (res.payload?.data) {
			res.payload.data = normalizeStudent(res.payload.data);
		}
		return res;
	},

	studentsByClass: async (
		schoolId: number,
		classId: number,
		token?: string
	) => {
		const res = await http.get<StudentArrayResType>(
			`/v1/students/get-student-by-class?schoolId=${schoolId}&classId=${classId}`,
			{
				token,
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				cache: 'no-store',
			}
		);
		if (Array.isArray(res.payload?.data)) {
			res.payload.data = res.payload.data.map(normalizeStudent);
		}
		return res;
	},

	create: (body: CreateStudentBodyType) => {
		const payload = {
			classId: body.classId,
			gradeId: body.gradeId ?? 0,
			userId: body.userId ?? body.accountId ?? 0,
			fullname: body.fullname,
			address: body.address || null,
			dateOfBirth: body.dateOfBirth
				? new Date(body.dateOfBirth).toISOString()
				: null,
			status: body.status ?? true,
			description: body.description || null,
		};
		return http.post<StudentResType>('/v1/students', payload);
	},

	update: (id: number, body: UpdateStudentBodyType) => {
		const payload = {
			id,
			classId: body.classId,
			gradeId: body.gradeId ?? 0,
			userId: body.userId ?? body.accountId ?? 0,
			fullname: body.fullname,
			address: body.address || null,
			dateOfBirth: body.dateOfBirth
				? new Date(body.dateOfBirth).toISOString()
				: null,
			status: body.status ?? true,
			description: body.description || null,
		};
		return http.put<StudentResType>(`/v1/students/${id}`, payload);
	},

	delete: (id: number) =>
		http.delete<ApiResponse<boolean>>(`/v1/students/${id}`),

	bulkDelete: (ids: number[]) =>
		http.delete<ApiResponse<boolean>>('/v1/students/bulk-delete', ids),

	bulkdelete: (ids: number[]) =>
		http.delete<ApiResponse<boolean>>('/v1/students/bulk-delete', ids),

	upload: (file: FormData) =>
		http.post<MessageResType>('/v1/students/upload', file),
};

export default studentApiRequest;
