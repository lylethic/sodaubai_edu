import React from 'react';
import { cookies } from 'next/headers';
import { lopHocApiRequest } from '@/apiRequests/lopHoc';
import ClassesList from './_components/classes-list';
import { LopHocResType } from '@/schemaValidations/lopHoc.shema';

type LopHocType = LopHocResType['data'];

export default async function ClassesPage() {
	const cookieStore = cookies();
	const token = cookieStore.get('accessToken')?.value;

	let initialClasses: LopHocType[] = [];
	let initialTotalCount = 0;

	if (token) {
		try {
			const res = await lopHocApiRequest.classes(
				{ pageNumber: 1, pageSize: 20 },
				token
			);
			const payload = res.payload as any;
			initialClasses =
				payload?.data?.items ||
				(Array.isArray(payload?.data) ? payload.data : []);
			initialTotalCount =
				payload?.data?.totalCount ?? initialClasses.length;
		} catch (error) {
			console.error('Failed to load classes on server', error);
		}
	}

	return (
		<div className='block w-full overflow-x-auto'>
			<h1 className='text-xl text-center uppercase p-2 border-b'>
				Danh sách lớp học
			</h1>
			<ClassesList
				initialClasses={initialClasses}
				initialTotalCount={initialTotalCount}
			/>
		</div>
	);
}
