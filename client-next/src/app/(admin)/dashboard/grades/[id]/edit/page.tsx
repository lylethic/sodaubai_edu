import React, { cache } from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';
import envConfig from '@/config';
import { baseOpenGraph } from '@/app/shared-metadata';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import schoolApiRequest from '@/apiRequests/school';
import GradeUpSertForm from '../../_components/grade-upsert.form';
import { gradeApiRequest } from '@/apiRequests/grade';

const getDetail = cache(gradeApiRequest.grade);

type Props = {
	params: { id: string };
	searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
	{ params, searchParams }: Props,
	parent: ResolvingMetadata
): Promise<Metadata> {
	const cookieStore = cookies();
	const accessToken = cookieStore.get('accessToken');
	const { payload } = await getDetail(Number(params.id), accessToken?.value);

	const result = payload.data;
	const url =
		envConfig.NEXT_PUBLIC_URL + '/dashboard/grades/' + result?.gradeId;

	return {
		title: result.gradeName,
		openGraph: {
			...baseOpenGraph,
			title: result.gradeName,
			url,
		},
		alternates: {
			canonical: url,
		},
	};
}

export default async function GradeEditPage({ params }: Props) {
	const cookieStore = cookies();
	const token = cookieStore.get('accessToken');
	if (!token) return;
	let result = null;
	try {
		const { payload } = await getDetail(Number(params.id), token.value);
		result = payload.data;
	} catch (error) {}

	return (
		<div className='flex flex-col items-center justify-center'>
			<h1 className='text-center mt-4 text-lg uppercase font-bold'>
				Chỉnh sửa khối lớp
			</h1>
			<Link href={'/dashboard/grades'}>
				<Button variant={'default'} className='border my-4' title='Quay về'>
					<ArrowLeft />
				</Button>
			</Link>
			{!result && <div>Không tìm thấy thông tin!</div>}
			{result && <GradeUpSertForm grade={result} />}
		</div>
	);
}
