import { MessageResType } from '@/schemaValidations/common.schema';
import {
	CreatePhanCongBodyType,
	PhanCongGiangDayResType,
	PhanCongGiangDaySchemaResType,
	UpdatePhanCongBodyType,
} from './../schemaValidations/phanCongGiangDayBia';
import http from '@/lib/http';
import { QueryType } from '@/types/queryType';

export const phanCongGiangDayApiRequest = {
	// api/PhanCongGiangDays/get-info-by-bia?id=4
	getPhanCongByBia: (id: number, token: string) =>
		http.get<PhanCongGiangDayResType>(
			`/PhanCongGiangDays/get-info-by-bia?id=${id}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
				cache: 'no-store',
			}
		),

	phanCongGiangDays: (page: QueryType) =>
		http.get<PhanCongGiangDayResType>(
			`PhanCongGiangDays?pageNumber=${page.pageNumber}&pageSize=${page.pageSize}`,
			{
				cache: 'no-store',
			}
		),

	phanCongGiangDay: (id: number, token?: string) =>
		http.get<PhanCongGiangDayResType>(`PhanCongGiangDays/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			cache: 'no-store',
		}),

	create: (body: CreatePhanCongBodyType) =>
		http.post<MessageResType>('/PhanCongGiangDays', body),

	update: (id: number, body: UpdatePhanCongBodyType) =>
		http.put<MessageResType>(`/PhanCongGiangDays/${id}`, body),

	delete: (id: number) =>
		http.delete<MessageResType>(`/PhanCongGiangDays/${id}`),

	bulkdelete: (ids: number[]) =>
		http.delete<MessageResType>('/PhanCongGiangDays', ids),

	upload: (formData: FormData) =>
		http.post<MessageResType>('/PhanCongGiangDays/upload', formData),
};
