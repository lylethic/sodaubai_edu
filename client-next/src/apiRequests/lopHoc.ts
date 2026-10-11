import http from '@/lib/http';
import { MessageResType } from '@/schemaValidations/common.schema';
import {
	CreateLopHocBodyType,
	LopHocListResType,
	LopHocResDetailsToUpdateType,
	LopHocResType,
	UpdateLopHocBodyType,
} from '@/schemaValidations/lopHoc.shema';
import { ApiResponse, buildQueryString, QueryObject } from '@/types/api';
import { QueryType } from '@/types/queryType';

const normalizeClass = (item: any) => {
	if (!item) return item;
	const id = item.id ?? item.classId ?? 0;
	const className = item.className ?? item.name ?? '';
	return {
		...item,
		id,
		classId: item.classId ?? id,
		name: item.name ?? className,
		className,
	};
};

export interface ClassSearchQuery extends QueryObject {
	gradeId?: number | null;
	teacherId?: number | null;
	academicYearId?: number | null;
	schoolId?: number | null;
	level?: number | null;
}

export const lopHocApiRequest = {
	classes: async (query: QueryType | ClassSearchQuery, token?: string) => {
		const res = await http.get<LopHocListResType>(
			`/v1/classes${buildQueryString(query as QueryObject)}`,
			{
				token,
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				cache: 'no-store',
			}
		);
		if (res.payload?.data?.items) {
			res.payload.data.items = res.payload.data.items.map(normalizeClass);
		}
		return res;
	},

	class: async (id: number, token?: string) => {
		const res = await http.get<LopHocResType>(`/v1/classes/${id}`, {
			token,
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
			cache: 'no-store',
		});
		if (res.payload?.data) {
			res.payload.data = normalizeClass(res.payload.data);
		}
		return res;
	},

	getDetail: async (id: number, token?: string) => {
		const res = await http.get<LopHocResDetailsToUpdateType>(
			`/v1/classes/${id}`,
			{
				token,
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				cache: 'no-store',
			}
		);
		if (res.payload?.data) {
			res.payload.data = normalizeClass(res.payload.data);
		}
		return res;
	},

	getLopHocBySchool: async (
		query: QueryType,
		schoolId: number | null,
		token?: string
	) => {
		const queryObj = { ...query, schoolId };
		const res = await http.get<LopHocListResType>(
			`/v1/classes${buildQueryString(queryObj as QueryObject)}`,
			{
				token,
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				cache: 'no-store',
			}
		);
		if (res.payload?.data?.items) {
			res.payload.data.items = res.payload.data.items.map(normalizeClass);
		}
		return res;
	},

	getLopHocBySchoolNoLimit: async (
		schoolId: number | null,
		token?: string
	) => {
		const res = await http.get<LopHocListResType>(
			`/v1/classes?schoolId=${schoolId}&pageNumber=1&pageSize=1000`,
			{
				token,
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				cache: 'no-store',
			}
		);
		if (res.payload?.data?.items) {
			res.payload.data.items = res.payload.data.items.map(normalizeClass);
		}
		return res;
	},

	lopChuNhiem: async (teacherId: number, token?: string) => {
		const res = await http.get<LopHocListResType>(
			`/v1/classes?teacherId=${teacherId}&pageNumber=1&pageSize=1`,
			{
				token,
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				cache: 'no-store',
			}
		);
		const items = res.payload?.data?.items || [];
		const firstItem = items.length > 0 ? normalizeClass(items[0]) : null;
		return {
			...res,
			payload: {
				...res.payload,
				data: firstItem,
			},
		};
	},

	create: (body: CreateLopHocBodyType) => {
		const payload = {
			className: body.className || body.ClassName || body.name || '',
			gradeId: body.gradeId ?? body.GradeId ?? 0,
			teacherId: body.teacherId ?? body.TeacherId ?? 0,
			academicYearId: body.academicYearId ?? body.AcademicYearId ?? 0,
			schoolId: body.schoolId ?? body.SchoolId ?? 0,
			status: body.status ?? body.Status ?? true,
			description: body.description ?? body.Description ?? '',
		};
		return http.post<LopHocResType>('/v1/classes', payload);
	},

	createBulk: (classes: CreateLopHocBodyType[]) => {
		const payload = classes.map((body) => ({
			className: body.className || body.ClassName || body.name || '',
			gradeId: body.gradeId ?? body.GradeId ?? 0,
			teacherId: body.teacherId ?? body.TeacherId ?? 0,
			academicYearId: body.academicYearId ?? body.AcademicYearId ?? 0,
			schoolId: body.schoolId ?? body.SchoolId ?? 0,
			status: body.status ?? body.Status ?? true,
			description: body.description ?? body.Description ?? '',
		}));
		return http.post<ApiResponse<boolean>>('/v1/classes/create', payload);
	},

	update: (id: number, body: UpdateLopHocBodyType) => {
		const payload = {
			id,
			className: body.className || body.ClassName || body.name || '',
			gradeId: body.gradeId ?? body.GradeId ?? 0,
			teacherId: body.teacherId ?? body.TeacherId ?? 0,
			academicYearId: body.academicYearId ?? body.AcademicYearId ?? 0,
			schoolId: body.schoolId ?? body.SchoolId ?? 0,
			status: body.status ?? body.Status ?? true,
			description: body.description ?? body.Description ?? '',
		};
		return http.put<LopHocResType>(`/v1/classes/${id}`, payload);
	},

	delete: (id: number) => http.delete<ApiResponse<string | boolean>>(`/v1/classes/${id}`),

	bulkdelete: (ids: number[]) =>
		http.delete<ApiResponse<string | boolean>>('/v1/classes/bulkdelete', ids),

	upload: (formData: FormData) =>
		http.post<MessageResType>('/v1/classes/upload', formData),
};

export default lopHocApiRequest;
