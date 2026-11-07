import http from '@/lib/http';
import { MessageResType } from '@/schemaValidations/common.schema';
import {
	CreateSubjectBodyType,
	SubjectListResType,
	SubjectResType,
	UpdateSubjectBodyType,
} from '@/schemaValidations/subject.schema';
import { ApiResponse, buildQueryString, QueryObject } from '@/types/api';
import { QueryType } from '@/types/queryType';

export interface SubjectQuery extends QueryObject {
	gradeId?: number | null;
}

const normalizeSubject = (item: any) => {
	if (!item) return item;
	const id = item.id ?? item.subjectId ?? 0;
	const name = item.name ?? item.subjectName ?? '';
	const gradeName =
		item.gradeName ??
		item.extendGrade?.name ??
		item.grade?.name ??
		'';
	return {
		...item,
		id,
		subjectId: item.subjectId ?? id,
		name,
		subjectName: item.subjectName ?? name,
		gradeName,
	};
};

export const subjectApiRequest = {
	subjects: async (queryObject: QueryType | SubjectQuery, token?: string) => {
		const res = await http.get<SubjectListResType>(
			`/v1/subjects${buildQueryString(queryObject as QueryObject)}`,
			{
				token,
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				cache: 'no-store',
			}
		);
		if (res.payload?.data?.items) {
			res.payload.data.items = res.payload.data.items.map(normalizeSubject);
		}
		return res;
	},

	subjectsNoPagination: async (token?: string) => {
		const res = await http.get<SubjectListResType>(
			'/v1/subjects?pageNumber=1&pageSize=1000',
			{
				token,
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				cache: 'no-store',
			}
		);
		if (res.payload?.data?.items) {
			res.payload.data.items = res.payload.data.items.map(normalizeSubject);
		}
		return res;
	},

	subject: async (id: number, token?: string) => {
		const res = await http.get<SubjectResType>(`/v1/subjects/${id}`, {
			token,
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
			cache: 'no-store',
		});
		if (res.payload?.data) {
			res.payload.data = normalizeSubject(res.payload.data);
		}
		return res;
	},

	create: (body: CreateSubjectBodyType) => {
		const payload = {
			name: body.name || body.subjectName || '',
			gradeId: body.gradeId ?? null,
			status: body.status ?? true,
			description: body.description ?? '',
		};
		return http.post<SubjectResType>('/v1/subjects', payload);
	},

	update: (id: number, body: UpdateSubjectBodyType) => {
		const payload = {
			id,
			name: body.name || body.subjectName || '',
			gradeId: body.gradeId ?? null,
			status: body.status ?? true,
			description: body.description ?? '',
		};
		return http.put<SubjectResType>(`/v1/subjects/${id}`, payload);
	},

	delete: (id: number) => http.delete<ApiResponse<boolean>>(`/v1/subjects/${id}`),

	bulkdelete: (ids: number[]) =>
		http.delete<ApiResponse<boolean>>('/v1/subjects/bulk-delete', ids),

	upload: (file: FormData) =>
		http.post<MessageResType>('/v1/subjects/upload', file),
};

export default subjectApiRequest;
