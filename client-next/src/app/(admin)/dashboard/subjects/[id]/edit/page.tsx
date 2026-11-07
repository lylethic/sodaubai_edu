import React, { cache } from 'react';
import { cookies } from 'next/headers';
import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import envConfig from '@/config';
import { baseOpenGraph } from '@/app/shared-metadata';
import { ArrowLeft } from 'lucide-react';
import { subjectApiRequest } from '@/apiRequests/subject';
import SubjectUpSertForm from '../../_components/subject-add-upsert-form';

const getDetail = cache(subjectApiRequest.subject);

type Props = {
	params: { id: string };
	searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
	{ params }: Props,
	_parent: ResolvingMetadata
): Promise<Metadata> {
	const cookieStore = cookies();
	const accessToken = cookieStore.get('accessToken');
	const { payload } = await getDetail(Number(params.id), accessToken?.value);

	const result = payload.data;
	const subjectId = result?.id ?? result?.subjectId;
	const subjectName = result?.name ?? result?.subjectName ?? '';
	const url = envConfig.NEXT_PUBLIC_URL + '/dashboard/subjects/' + subjectId;

	return {
		title: 'Cập nhật môn ' + subjectName,
		openGraph: {
			...baseOpenGraph,
			title: 'Cập nhật môn ' + subjectName,
			url,
		},
		alternates: {
			canonical: url,
		},
	};
}

export default async function SubjectEditPage({ params }: Props) {
	const cookieStore = cookies();
	const token = cookieStore.get('accessToken');
	if (!token) return null;

	let result = null;
	try {
		const { payload } = await getDetail(Number(params.id), token.value);
		result = payload.data;
	} catch (error) {}

	return (
		<div className='flex flex-col items-center justify-center border rounded-xl mt-10 py-4'>
			<h1 className='text-center mt-4 text-lg uppercase font-bold p-2 border-b'>
				cập nhật môn học
			</h1>
			<Link
				href={'/dashboard/subjects'}
				className='flex justify-center items-center my-4'
			>
				<Button variant={'default'} type='button' title='Quay về'>
					<ArrowLeft />
					Quay về
				</Button>
			</Link>
			{!result && <div>Không có thông tin!</div>}
			{result && <SubjectUpSertForm subject={result} />}
		</div>
	);
}
