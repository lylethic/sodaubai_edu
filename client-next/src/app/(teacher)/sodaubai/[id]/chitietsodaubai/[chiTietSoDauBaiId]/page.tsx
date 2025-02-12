import React, { cache } from 'react';
import chiTietSoDauBaiApiRequest from '@/apiRequests/chiTietSoDauBai';
import ChiTietEditForm from '../../../_components/chitiet-edit-form';
import { cookies } from 'next/headers';
import { Metadata, ResolvingMetadata } from 'next';
import envConfig from '@/config';
import { baseOpenGraph } from '@/app/shared-metadata';

const getDetail = cache(chiTietSoDauBaiApiRequest.getDetail);
interface Props {
	params: {
		chiTietSoDauBaiId: string;
	};
	searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata(
	{ params, searchParams }: Props,
	parent: ResolvingMetadata
): Promise<Metadata> {
	const cookieStore = cookies();
	const accessToken = cookieStore.get('accessToken')!.value;
	const { payload } = await getDetail(
		Number(params.chiTietSoDauBaiId),
		accessToken
	);

	const chiTietSoDauBai = payload.data;
	const url =
		envConfig.NEXT_PUBLIC_URL +
		'/sodaubai/' +
		chiTietSoDauBai.biaSoDauBaiId +
		'/chitietsodaubai';
	return {
		title: chiTietSoDauBai.biaSoDauBaiId.toString(),
		openGraph: {
			...baseOpenGraph,
			title: chiTietSoDauBai.biaSoDauBaiId.toString(),
			url,
		},
		alternates: {
			canonical: url,
		},
	};
}

export default async function ChiTietEditPage({ params }: Props) {
	const cookieStore = cookies();
	const token = cookieStore.get('accessToken');

	let result = null;
	if (!token) return;

	try {
		const { payload } = await getDetail(
			Number(params.chiTietSoDauBaiId),
			token.value
		);
		result = payload.data;
	} catch (error) {}

	return (
		<div className='py-6'>
			<h1 className='text-center text-lg font-medium uppercase'>
				cập nhật tiết học
			</h1>
			<div>
				{!result ? (
					<div>Không tìm thấy chi tiết sổ đầu bài</div>
				) : (
					<ChiTietEditForm params={params} chiTietSoDauBai={result} />
				)}
			</div>
		</div>
	);
}
