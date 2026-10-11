import React from 'react';
import { cookies } from 'next/headers';
import { subjectApiRequest } from '@/apiRequests/subject';
import SubjectsList from './_components/subject-list';
import { SubjectResType } from '@/schemaValidations/subject.schema';

type SubjectType = SubjectResType['data'];

export default async function SubjectsPage() {
	const cookieStore = cookies();
	const token = cookieStore.get('accessToken')?.value;

	let initialSubjects: SubjectType[] = [];
	let initialTotalCount = 0;

	if (token) {
		try {
			const res = await subjectApiRequest.subjects(
				{ pageNumber: 1, pageSize: 20 },
				token
			);
			const payload = res.payload as any;
			initialSubjects =
				payload?.data?.items ||
				(Array.isArray(payload?.data) ? payload.data : []);
			initialTotalCount =
				payload?.data?.totalCount ?? initialSubjects.length;
		} catch (error) {
			console.error('Failed to load subjects on server', error);
		}
	}

	return (
		<div className='block w-full overflow-x-auto'>
			<h1 className='text-2xl text-center uppercase p-2 border-b'>
				Danh sách môn học
			</h1>
			<SubjectsList
				initialSubjects={initialSubjects}
				initialTotalCount={initialTotalCount}
			/>
		</div>
	);
}
