import http from '@/lib/http';
import { MessageResType } from '@/schemaValidations/common.schema';
import {
	CreateRollCallDetailBodyType,
	RollCallDetailResType,
	RollCallResType,
	UpdateRollCallDetailBodyType,
} from '@/schemaValidations/rollcall-schema';
import { QueryType } from '@/types/queryType';

export const rollCallDetailApiRequest = {
	rollCalls: (pag: QueryType) =>
		http.get<RollCallResType>(
			`/RollCallDetails?pageNumber=${pag.pageNumber}&pageSize=${pag.pageSize}`,
			{
				cache: 'no-store',
			}
		),

	rollCallDetailByRollCallId: (id: number) =>
		http.get<RollCallDetailResType>(
			`/RollCallDetails/get-detail-by-rollCallId?rollCallId=${id}`,
			{
				cache: 'no-store',
			}
		),

	rollCall: (id: number) =>
		http.get<RollCallDetailResType>(`/RollCallDetails/${id}`, {
			cache: 'no-store',
		}),

	create: (body: CreateRollCallDetailBodyType) =>
		http.post<RollCallDetailResType>('/RollCallDetails', body),

	update: (id: number, body: UpdateRollCallDetailBodyType) =>
		http.put<MessageResType>(`/RollCallDetails/${id}`, body),

	delete: (id: number) => http.delete<MessageResType>(`/RollCallDetails/${id}`),

	bulkdelete: (ids: number[]) =>
		http.delete<MessageResType>(`/RollCallDetails/bulk-delete`, ids),
};
