import React, { cache, Suspense } from 'react';
import SoDauBaiEditForm from '../../_components/sodaubai-edit-form';
import biaSoDauBaiApiRequest from '@/apiRequests/biasodaubai';
import { Metadata, ResolvingMetadata } from 'next';
import envConfig from '@/config';
import { baseOpenGraph } from '@/app/shared-metadata';
import { cookies } from 'next/headers';
import LoadingSpinner from '../../../loading';

const getSoDauBaiDetails = cache(biaSoDauBaiApiRequest.getDetailToUpdate);

type Props = {
	params: { id: string };
	searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
	{ params, searchParams }: Props,
	parent: ResolvingMetadata
): Promise<Metadata> {
	const cookieStore = cookies();
	const accessToken = cookieStore.get('accessToken')!.value;
	const { payload } = await getSoDauBaiDetails(Number(params.id), accessToken);

	const biaSoDauBai = payload.data;
	const url =
		envConfig.NEXT_PUBLIC_URL +
		'/dashboard/sodaubais/' +
		biaSoDauBai.biaSoDauBaiId;
	return {
		title: biaSoDauBai.biaSoDauBaiId.toString(),
		openGraph: {
			...baseOpenGraph,
			title: biaSoDauBai.biaSoDauBaiId.toString(),
			url,
		},
		alternates: {
			canonical: url,
		},
	};
}

export default async function EditBiaSoDauBaiPage({ params }: Props) {
	const cookieStore = cookies();
	const token = cookieStore.get('accessToken');

	let result = null;
	if (!token) return;
	try {
		const { payload } = await getSoDauBaiDetails(
			Number(params.id),
			token.value
		);
		result = payload.data;
	} catch (error) {}

	return (
		<Suspense fallback={<LoadingSpinner />}>
			<div className='py-6'>
				<h1 className='text-center text-lg font-medium uppercase'>
					cập nhật sổ đầu bài
				</h1>
				<div className='flex items-center justify-center '>
					{!result ? (
						<div>Không tìm thấy sổ đầu bài</div>
					) : (
						<SoDauBaiEditForm params={params} biaSoDauBai={result} />
					)}
				</div>
			</div>
		</Suspense>
	);
}
