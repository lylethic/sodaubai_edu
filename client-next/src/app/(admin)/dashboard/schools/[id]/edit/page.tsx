import React, { cache } from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';
import envConfig from '@/config';
import { baseOpenGraph } from '@/app/shared-metadata';
import { ArrowLeft } from 'lucide-react';
import SchoolUpSertForm from '../../_components/school-upsert-form';
import { Button } from '@/components/ui/button';
import schoolApiRequest from '@/apiRequests/school';

const getDetail = cache(schoolApiRequest.getSchool);

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
		envConfig.NEXT_PUBLIC_URL + '/dashboard/schools/' + result?.schoolId;

	return {
		title: result.nameSchool,
		openGraph: {
			...baseOpenGraph,
			title: result.nameSchool,
			url,
		},
		alternates: {
			canonical: url,
		},
	};
}

export default async function SchoolEditPage({ params }: Props) {
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
				Chỉnh sửa trường học
			</h1>
			<Link href={'/dashboard/schools'}>
				<Button variant={'default'} className='border my-4' title='Quay về'>
					<ArrowLeft />
				</Button>
			</Link>
			{!result && <div>Không tìm thấy thông tin!</div>}
			{result && <SchoolUpSertForm school={result} />}
		</div>
	);
}
