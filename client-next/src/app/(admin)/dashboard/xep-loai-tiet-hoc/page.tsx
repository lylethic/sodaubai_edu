import React from 'react';
import { cookies } from 'next/headers';
import { xepLoaiApiRequest } from '@/apiRequests/xeploaiTiethoc';
import XepLoaiTietHocList from './_components/xep-loai-tiet-hoc-list';
import { ClassificationResType } from '@/schemaValidations/xepLoaiTietHoc.schema';

type ClassifyType = ClassificationResType['data'];

export default async function XepLoaiTietHocPage() {
	const cookieStore = cookies();
	const token = cookieStore.get('accessToken')?.value;

	let initialClassifications: ClassifyType[] = [];
	let initialTotalCount = 0;

	if (token) {
		try {
			const res = await xepLoaiApiRequest.xeploais(
				{ pageNumber: 1, pageSize: 20 },
				token
			);
			const payload = res.payload as any;
			initialClassifications =
				payload?.data?.items ||
				(Array.isArray(payload?.data) ? payload.data : []);
			initialTotalCount =
				payload?.data?.totalCount ?? initialClassifications.length;
		} catch (error) {
			console.error('Failed to load classifications on server', error);
		}
	}

	return (
		<div className='block w-full overflow-x-auto'>
			<h1 className='text-2xl text-center uppercase p-2 border-b'>
				Danh sách điểm xếp loại
			</h1>
			<XepLoaiTietHocList
				initialClassifications={initialClassifications}
				initialTotalCount={initialTotalCount}
			/>
		</div>
	);
}
