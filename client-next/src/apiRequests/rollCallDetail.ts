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
		http.get<RollCallDetailResType>(
			`/v1/roll-call-details?pageNumber=${pag.pageNumber}&pageSize=${pag.pageSize}`,
			{
				cache: 'no-store',
			}
		),

	rollCallDetailByRollCallId: (id: number) =>
		http.get<RollCallDetailResType>(
			`/v1/roll-call-details/get-detail-by-rollCallId?rollCallId=${id}`,
			{
				cache: 'no-store',
			}
		),

	rollCall: (id: number) =>
		http.get<RollCallDetailResType>(`/v1/roll-call-details/${id}`, {
			cache: 'no-store',
		}),

	create: (body: CreateRollCallDetailBodyType) =>
		http.post<RollCallDetailResType>('/v1/roll-call-details', body),

	update: (id: number, body: UpdateRollCallDetailBodyType) =>
		http.put<MessageResType>(`/v1/roll-call-details/${id}`, body),

	delete: (id: number) =>
		http.delete<MessageResType>(`/v1/roll-call-details/${id}`),

	bulkdelete: (ids: number[]) =>
		http.delete<MessageResType>(`/v1/roll-call-details/bulk-delete/0`, ids),
};

export default rollCallDetailApiRequest;
