import http from '@/lib/http';
import { MessageResType } from '@/schemaValidations/common.schema';
import {
	CreatePhanCongChuNhiemBodyType,
	PhanCongChuNhiemListResType,
	PhanCongChuNhiemResType,
	UpdatePhanCongChuNhiemBodyType,
} from '@/schemaValidations/phanCongChuNhiemLop.schema';
import { ApiResponse, buildQueryString, QueryObject } from '@/types/api';
import { QueryType } from '@/types/queryType';

export interface PhanCongChuNhiemQuery extends QueryObject {
	schoolId?: number | null;
	teacherId?: number | null;
	classId?: number | null;
	academicYearId?: number | null;
	gradeId?: number | null;
}

const normalizePhanCongChuNhiem = (item: any) => {
	if (!item) return item;
	const id = item.id ?? item.phanCongChuNhiemId ?? 0;
	return {
		...item,
		id,
		phanCongChuNhiemId: item.phanCongChuNhiemId ?? id,
		teacherName: item.teacherName ?? item.extendTeacher?.fullname ?? '',
		nameClass: item.nameClass ?? item.extendClass?.className ?? '',
	};
};

export const phanCongChuNhiemApiRequest = {
	phanCongs: async (
		pageNumberOrQuery: number | QueryType | PhanCongChuNhiemQuery,
		pageSizeOrSchoolId?: number | null,
		schoolId?: number | null,
		gradeId?: number | null,
		classId?: number | null,
		token?: string
	) => {
		let query: PhanCongChuNhiemQuery = {};
		if (typeof pageNumberOrQuery === 'object') {
			query = { ...pageNumberOrQuery };
		} else {
			query = {
				pageNumber: pageNumberOrQuery,
				pageSize: (pageSizeOrSchoolId as number) || 20,
				schoolId: schoolId || undefined,
				gradeId: gradeId || undefined,
				classId: classId || undefined,
			};
		}

		const res = await http.get<PhanCongChuNhiemListResType>(
			`/v1/phan-cong-chu-nhiems${buildQueryString(query)}`,
			{
				token,
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				cache: 'no-store',
			}
		);
		if (res.payload?.data?.items) {
			res.payload.data.items = res.payload.data.items.map(
				normalizePhanCongChuNhiem
			);
		}
		return res;
	},

	phanCong: async (id: number, token?: string) => {
		const res = await http.get<PhanCongChuNhiemResType>(
			`/v1/phan-cong-chu-nhiems/${id}`,
			{
				token,
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				cache: 'no-store',
			}
		);
		if (res.payload?.data) {
			res.payload.data = normalizePhanCongChuNhiem(res.payload.data);
		}
		return res;
	},

	create: (body: CreatePhanCongChuNhiemBodyType) => {
		const payload = {
			teacherId: body.teacherId ?? body.TeacherId ?? 0,
			classId: body.classId ?? body.ClassId ?? 0,
			academicYearId: body.academicYearId ?? body.AcademicYearId ?? 0,
			status: body.status ?? body.Status ?? true,
			description: body.description ?? body.Description ?? null,
		};
		return http.post<PhanCongChuNhiemResType>(
			'/v1/phan-cong-chu-nhiems',
			payload
		);
	},

	update: (id: number, body: UpdatePhanCongChuNhiemBodyType) => {
		const payload = {
			id,
			teacherId: body.teacherId ?? body.TeacherId ?? 0,
			classId: body.classId ?? body.ClassId ?? 0,
			academicYearId: body.academicYearId ?? body.AcademicYearId ?? 0,
			status: body.status ?? body.Status ?? true,
			description: body.description ?? body.Description ?? null,
		};
		return http.put<PhanCongChuNhiemResType>(
			`/v1/phan-cong-chu-nhiems/${id}`,
			payload
		);
	},

	delete: (id: number) =>
		http.delete<ApiResponse<boolean>>(`/v1/phan-cong-chu-nhiems/${id}`),

	bulkDelete: (ids: number[]) =>
		http.delete<ApiResponse<boolean>>(
			'/v1/phan-cong-chu-nhiems/bulk-delete',
			ids
		),

	bulkdelete: (ids: number[]) =>
		http.delete<ApiResponse<boolean>>(
			'/v1/phan-cong-chu-nhiems/bulk-delete',
			ids
		),

	upload: (formData: FormData) =>
		http.post<MessageResType>('/v1/phan-cong-chu-nhiems/upload', formData),
};

export default phanCongChuNhiemApiRequest;
