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
	rollCalls: (pag: QueryType, weekId: number, classId?: number) => {
		const params = new URLSearchParams();
		if (pag.pageNumber) params.set('pageNumber', pag.pageNumber.toString());
		if (pag.pageSize) params.set('pageSize', pag.pageSize.toString());
		if (weekId) params.set('weekId', weekId.toString());
		if (classId) params.set('classId', classId.toString());

		return http.get<RollCallResType>(
			`/v1/roll-calls?${params.toString()}`,
			{
				cache: 'no-store',
			}
		);
	},

	rollCallByWeekAndClass: (
		query: QueryType,
		weekId: number,
		classId?: number
	) => {
		const params = new URLSearchParams();
		if (query.pageNumber) params.set('pageNumber', query.pageNumber.toString());
		if (query.pageSize) params.set('pageSize', query.pageSize.toString());
		if (weekId) params.set('weekId', weekId.toString());
		if (classId) params.set('classId', classId.toString());

		return http.get<RollCallResType>(
			`/v1/roll-calls?${params.toString()}`,
			{
				cache: 'no-store',
			}
		);
	},

	rollCall: (rollCallId: number) =>
		http.get<RollCallResType>(`/v1/roll-calls/${rollCallId}`, {
			cache: 'no-store',
		}),

	create: (body: RollCallFormValues | CreateRollCallBodyType | any) => {
		const rollCall = body.rollCall
			? {
					callRollId:
						body.rollCall.callRollId ?? body.rollCall.rollCallId ?? 0,
					classId: body.rollCall.classId,
					weekId: body.rollCall.weekId,
					dayOfTheWeek: body.rollCall.dayOfTheWeek,
					numberOfAttendants: body.rollCall.numberOfAttendants ?? 0,
					dateAt: body.rollCall.dateAt,
			  }
			: body;

		const absences = Array.isArray(body.absences)
			? body.absences.map((a: any) => ({
					callRollId: a.callRollId ?? a.rollCallId ?? 0,
					studentId: a.studentId,
					isExecute:
						a.isExecute !== undefined ? a.isExecute : (a.isExcused ?? false),
					description: a.description ?? '',
			  }))
			: [];

		return http.post<RollCallResType>('/v1/roll-calls', {
			rollCall,
			absences,
		});
	},

	update: (
		rollCallId: number,
		body: CreateRollCallBodyType | RollCallFormValues | any
	) => {
		if (body.absences !== undefined) {
			const rollCall = body.rollCall
				? {
						callRollId:
							body.rollCall.callRollId ?? body.rollCall.rollCallId ?? rollCallId,
						classId: body.rollCall.classId,
						weekId: body.rollCall.weekId,
						dayOfTheWeek: body.rollCall.dayOfTheWeek,
						numberOfAttendants: body.rollCall.numberOfAttendants ?? 0,
						dateAt: body.rollCall.dateAt,
				  }
				: body;

			const absences = Array.isArray(body.absences)
				? body.absences.map((a: any) => ({
						callRollId: a.callRollId ?? a.rollCallId ?? rollCallId,
						studentId: a.studentId,
						isExecute:
							a.isExecute !== undefined ? a.isExecute : (a.isExcused ?? false),
						description: a.description ?? '',
				  }))
				: [];

			return http.put<MessageResType>(`/v1/roll-calls/edit/${rollCallId}`, {
				rollCall,
				absences,
			});
		}

		return http.put<MessageResType>(`/v1/roll-calls/${rollCallId}`, body);
	},

	delete: (id: number) =>
		http.delete<MessageResType>(`/v1/roll-calls/${id}`),

	bulkdelete: (ids: number[]) =>
		http.delete<MessageResType>(`/v1/roll-calls/bulk-delete`, ids),
};

export default rollcallApiRequest;
