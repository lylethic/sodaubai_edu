import React from 'react';
import { cookies } from 'next/headers';
import { weekApiRequest } from '@/apiRequests/week';
import WeekList from './_components/week-list';
import { WeekResType } from '@/schemaValidations/week.schema';

type WeekType = WeekResType['data'];

export default async function WeeksPage() {
	const cookieStore = cookies();
	const token = cookieStore.get('accessToken')?.value;

	let initialWeeks: WeekType[] = [];
	let initialTotalCount = 0;

	if (token) {
		try {
			const res = await weekApiRequest.weeks(
				{ pageNumber: 1, pageSize: 20 },
				token
			);
			const payload = res.payload as any;
			initialWeeks =
				payload?.data?.items ||
				(Array.isArray(payload?.data) ? payload.data : []);
			initialTotalCount =
				payload?.data?.totalCount ?? initialWeeks.length;
		} catch (error) {
			console.error('Failed to load weeks on server', error);
		}
	}

	return (
		<div className='block w-full overflow-x-auto'>
			<h1 className='text-xl text-center uppercase p-2'>Danh sách tuần học</h1>
			<WeekList
				initialWeeks={initialWeeks}
				initialTotalCount={initialTotalCount}
			/>
		</div>
	);
}
