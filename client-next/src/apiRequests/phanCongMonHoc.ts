import http from '@/lib/http';
import { MessageResType } from '@/schemaValidations/common.schema';
import {
	CreateSubjectAssgmBodyType,
	SubjectAssgmListResType,
	SubjectAssgmResType,
	UpdateSubjectAssgmBodyType,
} from '@/schemaValidations/phanCongMonDay.schema';
import { ApiResponse, buildQueryString, QueryObject } from '@/types/api';
import { QueryType } from '@/types/queryType';

export interface SubjectAssgmQuery extends QueryObject {
	teacherId?: number | null;
	subjectId?: number | null;
}

const normalizeSubjectAssgm = (item: any) => {
	if (!item) return item;
	const id = item.id ?? item.subjectAssignmentId ?? 0;
	return {
		...item,
		id,
		subjectAssignmentId: item.subjectAssignmentId ?? id,
	};
};

export const PhanCongMonHocApiRequest = {
	subjectAssigments: async (
		query: QueryType | SubjectAssgmQuery,
		token?: string
	) => {
		const res = await http.get<SubjectAssgmListResType>(
			`/v1/subject-assmgts${buildQueryString(query as QueryObject)}`,
			{
				token,
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				cache: 'no-store',
			}
		);
		if (res.payload?.data?.items) {
			res.payload.data.items = res.payload.data.items.map(normalizeSubjectAssgm);
		}
		return res;
	},

	detail: async (id: number, token?: string) => {
		const res = await http.get<SubjectAssgmResType>(
			`/v1/subject-assmgts/${id}`,
			{
				token,
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				cache: 'no-store',
			}
		);
		if (res.payload?.data) {
			res.payload.data = normalizeSubjectAssgm(res.payload.data);
		}
		return res;
	},

	teacherBySubjectAssign: async (id: number, token?: string) => {
		const res = await http.get<ApiResponse<any>>(
			`/v1/subject-assmgts/teacher-by-subject-assign/${id}`,
			{
				token,
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				cache: 'no-store',
			}
		);
		return res;
	},

	getToUpdate: async (id: number, token?: string) => {
		const res = await http.get<SubjectAssgmResType>(
			`/v1/subject-assmgts/get-to-update/${id}`,
			{
				token,
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				cache: 'no-store',
			}
		);
		if (res.payload?.data) {
			res.payload.data = normalizeSubjectAssgm(res.payload.data);
		}
		return res;
	},

	create: (body: CreateSubjectAssgmBodyType) => {
		const payload = {
			teacherId: body.teacherId ?? body.TeacherId ?? 0,
			subjectId: body.subjectId ?? body.SubjectId ?? 0,
			description: body.description ?? body.Description ?? null,
		};
		return http.post<SubjectAssgmResType>('/v1/subject-assmgts', payload);
	},

	update: (id: number, body: UpdateSubjectAssgmBodyType) => {
		const payload = {
			subjectAssignmentId:
				body.subjectAssignmentId ?? body.id ?? id,
			teacherId: body.teacherId ?? body.TeacherId ?? 0,
			subjectId: body.subjectId ?? body.SubjectId ?? 0,
			description: body.description ?? body.Description ?? null,
		};
		return http.put<SubjectAssgmResType>(
			`/v1/subject-assmgts/${id}`,
			payload
		);
	},

	delete: (id: number) =>
		http.delete<ApiResponse<boolean>>(`/v1/subject-assmgts/${id}`),

	bulkDelete: (ids: number[]) =>
		http.delete<ApiResponse<boolean>>(
			'/v1/subject-assmgts/bulk-delete',
			ids
		),

	bulkdelete: (ids: number[]) =>
		http.delete<ApiResponse<boolean>>(
			'/v1/subject-assmgts/bulk-delete',
			ids
		),

	upload: (formData: FormData) =>
		http.post<MessageResType>('/v1/subject-assmgts/upload', formData),
};

export default PhanCongMonHocApiRequest;
