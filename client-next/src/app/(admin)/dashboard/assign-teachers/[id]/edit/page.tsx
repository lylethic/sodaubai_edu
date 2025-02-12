import React, { cache, Suspense } from 'react';
import { PhanCongChuNhiemApiRequest } from '@/apiRequests/phanCongChuNhiem';
import { cookies } from 'next/headers';
import LoadingSpinner from '../../../loading';
import AssignTeacherEditForm from '../../_components/assign-teacher-edit-form';
import { Metadata, ResolvingMetadata } from 'next';
import envConfig from '@/config';
import { baseOpenGraph } from '@/app/shared-metadata';

const getDetail = cache(PhanCongChuNhiemApiRequest.phanCong);

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
		account.phanCongChuNhiemId;
	return {
		title: account.nameClass,
		openGraph: {
			...baseOpenGraph,
			title: account.nameClass,
			url,
		},
		alternates: {
			canonical: url,
		},
	};
}

export default async function AssignTeacherEditPage({ params }: Props) {
	const cookieStore = cookies();
	const token = cookieStore.get('accessToken');
	if (!token) return;
	let result = null;
	try {
		const { payload } = await getDetail(Number(params.id), token.value);
		result = payload.data;
	} catch (error) {}

	return (
		<Suspense fallback={<LoadingSpinner />}>
			<div className='py-6'>
				<h1 className='text-center text-lg font-medium uppercase'>
					cập nhật nội dung phân công chủ nhiệm
				</h1>
				<div className='flex flex-col items-center justify-center '>
					{!result ? (
						<div>Không tìm thấy dữ liệu</div>
					) : (
						<AssignTeacherEditForm params={params} phanCongChuNhiem={result} />
					)}
				</div>
			</div>
		</Suspense>
	);
}
