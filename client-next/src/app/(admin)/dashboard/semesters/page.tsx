import React from 'react';
import { cookies } from 'next/headers';
import { semesterApiRequest } from '@/apiRequests/semester';
import SemestersList from './_components/semesters-list';
import { SemesterResType } from '@/schemaValidations/semester.schema';

type SemesterType = SemesterResType['data'];

export default async function SemestersPage() {
	const cookieStore = cookies();
	const token = cookieStore.get('accessToken')?.value;

	let initialSemesters: SemesterType[] = [];
	let initialTotalCount = 0;

	if (token) {
		try {
			const res = await semesterApiRequest.semesters(
				{ pageNumber: 1, pageSize: 20 },
				token
			);
			const payload = res.payload as any;
			initialSemesters =
				payload?.data?.items ||
				(Array.isArray(payload?.data) ? payload.data : []);
			initialTotalCount =
				payload?.data?.totalCount ?? initialSemesters.length;
		} catch (error) {
			console.error('Failed to load semesters on server', error);
		}
	}

	return (
		<div className='block w-full overflow-x-auto'>
			<h1 className='text-xl text-center uppercase p-2 border-b'>
				Danh sách học kỳ
			</h1>
			<SemestersList
				initialSemesters={initialSemesters}
				initialTotalCount={initialTotalCount}
			/>
		</div>
	);
}
