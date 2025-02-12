import { lopHocApiRequest } from '@/apiRequests/lopHoc';
import React, { cache, Suspense } from 'react';
import ClassEditForm from '../../_components/class-edit.form';
import LoadingSpinner from '../../../loading';
import { cookies } from 'next/headers';
import { Metadata, ResolvingMetadata } from 'next';
import envConfig from '@/config';
import { baseOpenGraph } from '@/app/shared-metadata';

const getDetailClass = cache(lopHocApiRequest.getDetail);

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
	const { payload } = await getDetailClass(Number(params.id), accessToken);

	const account = payload.data;
	const url =
		envConfig.NEXT_PUBLIC_URL + '/dashboard/accounts/' + account.classId;
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

export default async function LopHocEditPage({ params }: Props) {
	const cookieStore = cookies();
	const token = cookieStore.get('accessToken');
	if (!token) return;
	let result = null;
	try {
		const { payload } = await getDetailClass(Number(params.id), token.value);
		result = payload.data;
	} catch (error) {}

	return (
		<Suspense fallback={<LoadingSpinner />}>
			<div className='py-6'>
				<h1 className='text-center text-lg font-medium uppercase'>
					cập nhật lớp học
				</h1>
				<div className='flex flex-col items-center justify-center '>
					{!result ? (
						<div>Không tìm thấy dữ liệu</div>
					) : (
						<ClassEditForm params={params} lopHoc={result} />
					)}
				</div>
			</div>
		</Suspense>
	);
}
