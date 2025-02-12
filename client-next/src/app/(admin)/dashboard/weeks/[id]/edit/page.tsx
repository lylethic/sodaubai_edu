import { weekApiRequest } from '@/apiRequests/week';
import React, { cache } from 'react';
import WeekAddForm from '../../_components/week-add-form';
import { cookies } from 'next/headers';
import { Metadata, ResolvingMetadata } from 'next';
import envConfig from '@/config';
import { baseOpenGraph } from '@/app/shared-metadata';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const getDetail = cache(weekApiRequest.weekDetail);

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
	const { payload } = await getDetail(Number(params.id), accessToken);

	const result = payload.data;
	const url = envConfig.NEXT_PUBLIC_URL + '/dashboard/weeks/' + result.weekId;
	return {
		title: result.weekName,
		openGraph: {
			...baseOpenGraph,
			title: result.weekName,
			url,
		},
		alternates: {
			canonical: url,
		},
	};
}

export default async function EditPage({ params }: { params: { id: string } }) {
	const cookieStore = cookies();
	const token = cookieStore.get('accessToken');
	if (!token) return;
	let result = undefined;
	try {
		const { payload } = await getDetail(Number(params.id), token.value);
		result = payload.data;
	} catch (error) {}

	return (
		<div className='flex flex-col items-center justify-center mt-10'>
			{!result && <div>Không tìm thấy thông tin!</div>}
			<h1 className='text-center mt-4 text-lg uppercase font-bold'>
				cập nhật tuần học
			</h1>
			<Link href={'/dashboard/weeks'}>
				<Button variant={'default'} className='border my-4' title='Quay về'>
					<ArrowLeft />
				</Button>
			</Link>
			<WeekAddForm week={result} />
		</div>
	);
}
