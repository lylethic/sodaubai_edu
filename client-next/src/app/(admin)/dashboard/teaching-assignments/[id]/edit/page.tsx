import React, { cache, Suspense } from 'react';
import { phanCongChuNhiemApiRequest } from '@/apiRequests/phanCongChuNhiem';
import { cookies } from 'next/headers';
import LoadingSpinner from '../../../loading';
import { Metadata, ResolvingMetadata } from 'next';
import envConfig from '@/config';
import { baseOpenGraph } from '@/app/shared-metadata';
import TeachingAssignmentUpSert from '../../_components/upsert';
import { phanCongGiangDayApiRequest } from '@/apiRequests/phanCongGiangDay';

const getDetail = cache(phanCongGiangDayApiRequest.phanCongGiangDay);

type Props = {
	params: { id: string };
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
	{ params, searchParams }: Props,
	parent: ResolvingMetadata
): Promise<Metadata> {
	const cookieStore = cookies();
	const accessToken = cookieStore.get('accessToken')!.value;
	const { payload } = await getDetail(Number(params.id), accessToken);

	const account = payload.data;
	const url =
		envConfig.NEXT_PUBLIC_URL +
		'/dashboard/assign-teachers/' +
		account.phanCongGiangDayId;
	return {
		title: account.className,
		openGraph: {
			...baseOpenGraph,
			title: account.className,
			url,
		},
		alternates: {
			canonical: url,
		},
	};
}

export default async function TeachingAssignmentsEditPage({ params }: Props) {
	const cookieStore = cookies();
	const token = cookieStore.get('accessToken');
	if (!token) return;
	let result = null;
	try {
		const { payload } = await getDetail(Number(params.id), token.value);
		result = payload.data;
		console.log(result);
	} catch (error) {}

	return (
		<Suspense fallback={<LoadingSpinner />}>
			<div className='py-6'>
				<h1 className='text-center text-lg font-medium uppercase'>
					cập nhật nội dung phân công giảng dạy
				</h1>
				<div className='flex flex-col items-center justify-center '>
					{!result ? (
						<div>Không tìm thấy dữ liệu</div>
					) : (
						<TeachingAssignmentUpSert data={result} />
					)}
				</div>
			</div>
		</Suspense>
	);
}
