import React from 'react';
import { cookies } from 'next/headers';
import { namHocApiRequest } from '@/apiRequests/namHoc';
import SchoolYearsList from './_components/acdemic-years.list';
import { AcademicYearResType } from '@/schemaValidations/academicYear.schema';

type AcademicYearType = AcademicYearResType['data'];

export default async function SchoolYears() {
	const cookieStore = cookies();
	const token = cookieStore.get('accessToken')?.value;

	let initialYears: AcademicYearType[] = [];
	let initialTotalCount = 0;

	if (token) {
		try {
			const res = await namHocApiRequest.namHocs(
				{ pageNumber: 1, pageSize: 20 },
				token
			);
			const payload = res.payload as any;
			initialYears =
				payload?.data?.items ||
				(Array.isArray(payload?.data) ? payload.data : []);
			initialTotalCount =
				payload?.data?.totalCount ?? initialYears.length;
		} catch (error) {
			console.error('Failed to load academic years on server', error);
		}
	}

	return (
		<div className='block w-full overflow-x-auto'>
			<h1 className='text-xl text-center uppercase p-2 border-b'>
				danh sách năm học
			</h1>
			<SchoolYearsList
				initialAcademicYears={initialYears}
				initialTotalCount={initialTotalCount}
			/>
		</div>
	);
}
