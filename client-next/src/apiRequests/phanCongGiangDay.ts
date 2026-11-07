import http from '@/lib/http';
import { MessageResType } from '@/schemaValidations/common.schema';
import {
	CreatePhanCongBodyType,
	PhanCongGiangDayArrayResType,
	PhanCongGiangDayListResType,
	PhanCongGiangDayResType,
	UpdatePhanCongBodyType,
} from '../schemaValidations/phanCongGiangDayBia';
import { ApiResponse, buildQueryString, QueryObject } from '@/types/api';
import { QueryType } from '@/types/queryType';

export interface PhanCongGiangDayQuery extends QueryObject {
	biaSoDauBaiId?: number | null;
	teacherId?: number | null;
}

const normalizePhanCongGiangDay = (item: any) => {
	if (!item) return item;
	const id = item.id ?? item.phanCongGiangDayId ?? 0;
	return {
		...item,
		id,
		phanCongGiangDayId: item.phanCongGiangDayId ?? id,
	};
};

export const phanCongGiangDayApiRequest = {
	getPhanCongByBia: async (id: number, token?: string) => {
		const res = await http.get<PhanCongGiangDayArrayResType>(
			`/v1/phan-cong-giang-days/get-info-by-bia?id=${id}`,
			{
				token,
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				cache: 'no-store',
			}
		);
		if (Array.isArray(res.payload?.data)) {
			res.payload.data = res.payload.data.map(normalizePhanCongGiangDay);
		}
		return res;
	},

	phanCongGiangDays: async (
		page: QueryType | PhanCongGiangDayQuery,
		token?: string
	) => {
		const res = await http.get<PhanCongGiangDayListResType>(
			`/v1/phan-cong-giang-days${buildQueryString(page as QueryObject)}`,
			{
				token,
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				cache: 'no-store',
			}
		);
		if (res.payload?.data?.items) {
			res.payload.data.items = res.payload.data.items.map(
				normalizePhanCongGiangDay
			);
		}
		return res;
	},

	phanCongGiangDay: async (id: number, token?: string) => {
		const res = await http.get<PhanCongGiangDayResType>(
			`/v1/phan-cong-giang-days/${id}`,
			{
				token,
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				cache: 'no-store',
			}
		);
		if (res.payload?.data) {
			res.payload.data = normalizePhanCongGiangDay(res.payload.data);
		}
		return res;
	},

	create: (body: CreatePhanCongBodyType) => {
		const payload = {
			teacherId: body.teacherId,
			biaSoDauBaiId: body.biaSoDauBaiId,
			status: body.status ?? true,
		};
		return http.post<PhanCongGiangDayResType>(
			'/v1/phan-cong-giang-days',
			payload
		);
	},

	update: (id: number, body: UpdatePhanCongBodyType) => {
		const payload = {
			phanCongGiangDayId: body.phanCongGiangDayId ?? id,
			teacherId: body.teacherId,
			biaSoDauBaiId: body.biaSoDauBaiId,
			status: body.status ?? true,
		};
		return http.put<PhanCongGiangDayResType>(
			`/v1/phan-cong-giang-days/${id}`,
			payload
		);
	},

	delete: (id: number) =>
		http.delete<ApiResponse<boolean>>(`/v1/phan-cong-giang-days/${id}`),

	bulkDelete: (ids: number[]) =>
		http.delete<ApiResponse<boolean>>(
			'/v1/phan-cong-giang-days/bulk-delete',
			ids
		),

	bulkdelete: (ids: number[]) =>
		http.delete<ApiResponse<boolean>>(
			'/v1/phan-cong-giang-days/bulk-delete',
			ids
		),

	upload: (formData: FormData) =>
		http.post<MessageResType>('/v1/phan-cong-giang-days/upload', formData),
};

export default phanCongGiangDayApiRequest;
