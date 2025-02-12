import React, { cache } from 'react';
import { cookies } from 'next/headers';
import { Metadata, ResolvingMetadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import envConfig from '@/config';
import { baseOpenGraph } from '@/app/shared-metadata';
import { studentApiRequest } from '@/apiRequests/student';
import StudentUpSertForm from '../../_components/student-upsert-form';

const getDetail = cache(studentApiRequest.student);

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
		envConfig.NEXT_PUBLIC_URL + '/dashboard/students/' + result.studentId;

	return {
		title: result.fullname,
		openGraph: {
			...baseOpenGraph,
			title: result.fullname,
			url,
		},
		alternates: {
			canonical: url,
		},
	};
}

export default async function AcademicYearEditPage({
	params,
}: {
	params: { id: string };
}) {
	const cookieStore = cookies();
	const accessToken = cookieStore.get('accessToken');
	if (!accessToken) return;

	let result = null;
	try {
		const { payload } = await getDetail(Number(params.id), accessToken.value);
		result = payload.data;
	} catch (error) {}

	return (
		<div className='flex flex-col items-center justify-center'>
			<h1 className='text-center mt-4 text-lg uppercase font-bold'>
				cập nhật học sinh
			</h1>
			<Link href={'/dashboard/students'}>
				<Button variant={'default'} className='border my-4' title='Quay về'>
					<ArrowLeft />
				</Button>
			</Link>
			{!result && <div>Không tìm thấy thông tin!</div>}
			{result && <StudentUpSertForm student={result} />}
		</div>
	);
}
