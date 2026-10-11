import http from '@/lib/http';
import { MessageResType } from '@/schemaValidations/common.schema';
import {
	CreateTeacherBodyType,
	TeacherListResType,
	TeacherResType,
	UpdateTeacherBodyType,
} from '@/schemaValidations/teacher.schema';
import { ApiResponse, buildQueryString, QueryObject } from '@/types/api';
import { QueryType } from '@/types/queryType';

export interface TeacherQuery extends QueryObject {
	schoolId?: number | null;
	userId?: number | null;
}

const normalizeTeacher = (item: any) => {
	if (!item) return item;
	const id = item.id ?? item.teacherId ?? 0;
	const userId = item.userId ?? item.accountId ?? 0;
	return {
		...item,
		id,
		teacherId: item.teacherId ?? id,
		userId,
		accountId: item.accountId ?? userId,
	};
};

export const teacherApiRequest = {
	teachers: async (query: QueryType | TeacherQuery, token?: string) => {
		const res = await http.get<TeacherListResType>(
			`/v1/teachers${buildQueryString(query as QueryObject)}`,
			{
				token,
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				cache: 'no-store',
			}
		);
		if (res.payload?.data?.items) {
			res.payload.data.items = res.payload.data.items.map(normalizeTeacher);
		}
		return res;
	},

	teachersNoPagination: async (token?: string) => {
		const res = await http.get<TeacherListResType>(
			'/v1/teachers?pageNumber=1&pageSize=1000',
			{
				token,
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				cache: 'no-store',
			}
		);
		if (res.payload?.data?.items) {
			res.payload.data.items = res.payload.data.items.map(normalizeTeacher);
		}
		return res;
	},

	teacher: async (id: number, token?: string) => {
		const res = await http.get<TeacherResType>(`/v1/teachers/${id}`, {
			token,
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
			cache: 'no-store',
		});
		if (res.payload?.data) {
			res.payload.data = normalizeTeacher(res.payload.data);
		}
		return res;
	},

	teacherDetail: async (id: number, token?: string) => {
		return teacherApiRequest.teacher(id, token);
	},

	teacherDetailToUpdate: async (id: number, token?: string) => {
		return teacherApiRequest.teacher(id, token);
	},

	teachersBySchool: async (
		query: QueryType,
		schoolId?: number | null,
		token?: string
	) => {
		const queryObj = {
			...query,
			schoolId: schoolId ? schoolId : undefined,
		};
		return teacherApiRequest.teachers(queryObj, token);
	},

	teachersBySchoolNoLimit: async (
		page: QueryType,
		schoolId: number,
		token?: string
	) => {
		return teacherApiRequest.teachers(
			{ ...page, schoolId, pageSize: 1000 },
			token
		);
	},

	teacherByAccountId: async (userId?: number | null, token?: string) => {
		const res = await http.get<TeacherListResType>(
			`/v1/teachers?userId=${userId ?? ''}&pageNumber=1&pageSize=1`,
			{
				token,
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				cache: 'no-store',
			}
		);
		const items = res.payload?.data?.items || [];
		const first = items.length > 0 ? normalizeTeacher(items[0]) : null;
		return {
			...res,
			payload: {
				...res.payload,
				data: first,
			},
		};
	},

	create: (body: CreateTeacherBodyType) => {
		const payload = {
			userId: body.userId ?? body.accountId ?? body.AccountId ?? 0,
			schoolId: body.schoolId ?? body.SchoolId ?? 0,
			fullname: body.fullname || body.Fullname || '',
			dateOfBirth: body.dateOfBirth
				? new Date(body.dateOfBirth).toISOString()
				: body.DateOfBirth
				? new Date(body.DateOfBirth).toISOString()
				: new Date().toISOString(),
			gender: body.gender ?? body.Gender ?? true,
			address: body.address ?? body.Address ?? '',
			status: body.status ?? body.Status ?? true,
			photoPath:
				typeof body.photoPath === 'string'
					? body.photoPath
					: typeof body.PhotoPath === 'string'
					? body.PhotoPath
					: null,
		};
		return http.post<TeacherResType>('/v1/teachers', payload);
	},

	update: (id: number, body: UpdateTeacherBodyType) => {
		const payload = {
			userId: body.userId ?? body.accountId ?? body.AccountId ?? 0,
			schoolId: body.schoolId ?? body.SchoolId ?? 0,
			fullname: body.fullname || body.Fullname || '',
			dateOfBirth: body.dateOfBirth
				? new Date(body.dateOfBirth).toISOString()
				: body.DateOfBirth
				? new Date(body.DateOfBirth).toISOString()
				: new Date().toISOString(),
			gender: body.gender ?? body.Gender ?? true,
			address: body.address ?? body.Address ?? '',
			status: body.status ?? body.Status ?? true,
			photoPath:
				typeof body.photoPath === 'string'
					? body.photoPath
					: typeof body.PhotoPath === 'string'
					? body.PhotoPath
					: null,
		};
		return http.put<TeacherResType>(`/v1/teachers/${id}`, payload);
	},

	uploadAvatar: (formData: FormData) =>
		http.post<TeacherResType>('/v1/teachers/upload', formData),

	delete: (id: number) =>
		http.delete<ApiResponse<boolean>>(`/v1/teachers/${id}`),

	bulkDelete: (ids: number[]) =>
		http.delete<ApiResponse<boolean>>('/v1/teachers/bulkdelete', ids),

	bulkdelete: (ids: number[]) =>
		http.delete<ApiResponse<boolean>>('/v1/teachers/bulkdelete', ids),

	importExcel: (formData: FormData) =>
		http.post<MessageResType>('/v1/teachers/upload-excel', formData),

	relativeSearchTeachers: (
		pageNumber: number,
		pageSize: number,
		schoolId?: number,
		name?: string
	) => {
		const queryObj: TeacherQuery = {
			pageNumber,
			pageSize,
			schoolId: schoolId || undefined,
			keyword: name || undefined,
		};
		return teacherApiRequest.teachers(queryObj);
	},
};

export default teacherApiRequest;
