import http from '@/lib/http';
import { MessageResType } from '@/schemaValidations/common.schema';
import {
	CreateRollCallBodyType,
	RollCallByIdType,
	RollCallResType,
} from '@/schemaValidations/rollcall-schema';
import { QueryType } from '@/types/queryType';
import RollCallFormValues from '@/types/RollCallFormValues';

export const rollcallApiRequest = {
	rollCalls: (pag: QueryType, weekId: number, classId?: number) =>
		http.get<RollCallResType>(
			`/RollCalls?pageNumber=${pag.pageNumber}&pageSize=${pag.pageSize}&weekId=${weekId}&classId=${classId}`,
			{
				cache: 'no-store',
			}
		),

	// api/RollCalls/get-by-week-class?PageNumber=1&PageSize=20&weekId=1&classId=21
	rollCallByWeekAndClass: (
		query: QueryType,
		weekId: number,
		classId?: number
	) =>
		http.get<RollCallResType>(
			`/RollCalls/get-by-week-class?pageNumber=${query.pageNumber}&pageSize=${query.pageSize}&weekId=${weekId}&classId=${classId}`
		),

	rollCall: (rollCallId: number) =>
		http.get<RollCallResType>(`/RollCalls/${rollCallId}`, {
			cache: 'no-store',
		}),

	create: (body: RollCallFormValues) =>
		http.post<RollCallResType>('/RollCalls', body),

	update: (rollCallId: number, body: CreateRollCallBodyType) =>
		http.put<MessageResType>(`/RollCalls/${rollCallId}`, body),

	delete: (id: number) => http.delete<MessageResType>(`/RollCalls/${id}`),

	bulkdelete: (ids: number[]) =>
		http.delete<MessageResType>(`/RollCalls/bulk-delete`, ids),
};
