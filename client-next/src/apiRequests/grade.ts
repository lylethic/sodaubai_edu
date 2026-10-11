import http from '@/lib/http';
import { MessageResType } from '@/schemaValidations/common.schema';
import {
	CreateGradeBodyType,
	GradeDetailResType,
	GradeListResType,
	GradeResType,
	UpdateGradeBodyType,
} from '@/schemaValidations/grade.schema';
import { ApiResponse, buildQueryString, QueryObject } from '@/types/api';
import { QueryType } from '@/types/queryType';

export interface GradeQuery extends QueryObject {
	academicYearId?: number | null;
}

const normalizeGrade = (item: any) => {
	if (!item) return item;
	const id = item.id ?? item.gradeId ?? 0;
	const name = item.name ?? item.gradeName ?? '';
	return {
		...item,
		id,
		gradeId: item.gradeId ?? id,
		name,
		gradeName: item.gradeName ?? name,
	};
};

export const gradeApiRequest = {
	grades: async (queryObject: QueryType | GradeQuery, token?: string) => {
		const res = await http.get<GradeListResType>(
			`/v1/grades${buildQueryString(queryObject as QueryObject)}`,
			{
				token,
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				cache: 'no-store',
			}
		);
		if (res.payload?.data?.items) {
			res.payload.data.items = res.payload.data.items.map(normalizeGrade);
		}
		return res;
	},

	gradesNoPagination: async (token?: string) => {
		const res = await http.get<GradeListResType>(
			'/v1/grades?pageNumber=1&pageSize=1000',
			{
				token,
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				cache: 'no-store',
			}
		);
		if (res.payload?.data?.items) {
			res.payload.data.items = res.payload.data.items.map(normalizeGrade);
		}
		return res;
	},

	grade: async (id: number, token?: string) => {
		const res = await http.get<GradeResType>(`/v1/grades/${id}`, {
			token,
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
			cache: 'no-store',
		});
		if (res.payload?.data) {
			res.payload.data = normalizeGrade(res.payload.data);
		}
		return res;
	},

	create: (body: CreateGradeBodyType) => {
		const payload = {
			name: body.name || body.gradeName || '',
			academicYearId: body.academicYearId,
			description: body.description ?? '',
		};
		return http.post<GradeResType>('/v1/grades', payload);
	},

	update: (id: number, body: UpdateGradeBodyType) => {
		const payload = {
			id,
			name: body.name || body.gradeName || '',
			academicYearId: body.academicYearId,
			description: body.description ?? '',
		};
		return http.put<GradeResType>(`/v1/grades/${id}`, payload);
	},

	delete: (id: number) => http.delete<ApiResponse<boolean>>(`/v1/grades/${id}`),

	bulkdelete: (ids: number[]) =>
		http.delete<ApiResponse<boolean>>('/v1/grades/bulkdelete', ids),

	upload: (file: FormData) => http.post<MessageResType>('/v1/grades/upload', file),

	export: (ids: number[]) =>
		http.post<Blob>('/v1/grades/export', ids),
};

export default gradeApiRequest;
