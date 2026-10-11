import http from '@/lib/http';
import { MessageResType } from '@/schemaValidations/common.schema';
import {
	ClassificationListResType,
	ClassificationResType,
	CreateClassificationBodyType,
	UpdateClassificationBodyType,
} from '@/schemaValidations/xepLoaiTietHoc.schema';
import { ApiResponse, buildQueryString, QueryObject } from '@/types/api';
import { QueryType } from '@/types/queryType';

const normalizeClassification = (item: any) => {
	if (!item) return item;
	const id = item.id ?? item.classificationId ?? 0;
	const name = item.name ?? item.classifyName ?? '';
	return {
		...item,
		id,
		classificationId: item.classificationId ?? id,
		name,
		classifyName: item.classifyName ?? name,
	};
};

export const xepLoaiApiRequest = {
	xeploais: async (queryObject: QueryType, token?: string) => {
		const res = await http.get<ClassificationListResType>(
			`/v1/classifications${buildQueryString(queryObject as QueryObject)}`,
			{
				token,
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				cache: 'no-store',
			}
		);
		if (res.payload?.data?.items) {
			res.payload.data.items =
				res.payload.data.items.map(normalizeClassification);
		}
		return res;
	},

	xeploaisNoPagination: async (token?: string) => {
		const res = await http.get<ClassificationListResType>(
			'/v1/classifications?pageNumber=1&pageSize=1000',
			{
				token,
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				cache: 'no-store',
			}
		);
		if (res.payload?.data?.items) {
			res.payload.data.items =
				res.payload.data.items.map(normalizeClassification);
		}
		return res;
	},

	xeploai: async (id: number, token?: string) => {
		const res = await http.get<ClassificationResType>(
			`/v1/classifications/${id}`,
			{
				token,
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				cache: 'no-store',
			}
		);
		if (res.payload?.data) {
			res.payload.data = normalizeClassification(res.payload.data);
		}
		return res;
	},

	create: (body: CreateClassificationBodyType) => {
		const payload = {
			name: body.name || body.classifyName || '',
			score: body.score ?? 0,
		};
		return http.post<ClassificationResType>('/v1/classifications', payload);
	},

	update: (id: number, body: UpdateClassificationBodyType) => {
		const payload = {
			id,
			name: body.name || body.classifyName || '',
			score: body.score ?? 0,
		};
		return http.put<ClassificationResType>(`/v1/classifications/${id}`, payload);
	},

	delete: (id: number) =>
		http.delete<ApiResponse<boolean>>(`/v1/classifications/${id}`),

	bulkdelete: (ids: number[]) =>
		http.delete<ApiResponse<boolean>>('/v1/classifications/bulkdelete', ids),

	upload: (file: FormData) =>
		http.post<MessageResType>('/v1/classifications/upload', file),
};

export default xepLoaiApiRequest;
