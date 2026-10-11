import React from 'react';
import { cookies } from 'next/headers';
import { gradeApiRequest } from '@/apiRequests/grade';
import GradesList from './_components/grades-list';
import { GradeResType } from '@/schemaValidations/grade.schema';

type GradeType = GradeResType['data'];

export default async function GradePage() {
	const cookieStore = cookies();
	const token = cookieStore.get('accessToken')?.value;

	let initialGrades: GradeType[] = [];
	let initialTotalCount = 0;

	if (token) {
		try {
			const res = await gradeApiRequest.grades(
				{ pageNumber: 1, pageSize: 20 },
				token
			);
			const payload = res.payload as any;
			initialGrades =
				payload?.data?.items ||
				(Array.isArray(payload?.data) ? payload.data : []);
			initialTotalCount =
				payload?.data?.totalCount ?? initialGrades.length;
		} catch (error) {
			console.error('Failed to load grades on server', error);
		}
	}

	return (
		<div className='block w-full overflow-x-auto'>
			<h1 className='text-2xl text-center uppercase p-2 border-b'>
				Danh sách khối lớp
			</h1>
			<GradesList
				initialGrades={initialGrades}
				initialTotalCount={initialTotalCount}
			/>
		</div>
	);
}
