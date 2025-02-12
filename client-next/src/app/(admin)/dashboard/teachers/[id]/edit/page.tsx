import React, { cache } from 'react';
import { cookies } from 'next/headers';
import { Metadata, ResolvingMetadata } from 'next';
import envConfig from '@/config';
import { baseOpenGraph } from '@/app/shared-metadata';
import teacherApiRequest from '@/apiRequests/teacher';
import TeacherUpdateForm from '../../_components/teacher-update-form';

const getDetail = cache(teacherApiRequest.teacherDetailToUpdate);

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

	const teacher = payload.data;
	const url =
		envConfig.NEXT_PUBLIC_URL + '/dashboard/teachers/' + teacher.teacherId;
	return {
		title: teacher.fullname,
		openGraph: {
			...baseOpenGraph,
			title: teacher.fullname,
			url,
		},
		alternates: {
			canonical: url,
		},
	};
}

export default async function TeacherEditPage({ params }: Props) {
	const cookieStore = cookies();
	const token = cookieStore.get('accessToken');

	let result = null;
	if (!token) return;
	try {
		const { payload } = await getDetail(Number(params.id), token.value);
		result = payload.data;
		console.log(result);
	} catch (error) {}

	return (
		<div className='py-6'>
			<h1 className='text-center text-lg font-medium uppercase'>
				cập nhật giáo viên
			</h1>
			<div className='flex items-center justify-center '>
				{!result ? (
					<div>Không tìm thấy giáo viên</div>
				) : (
					<TeacherUpdateForm params={params} teacher={result} />
				)}
			</div>
		</div>
	);
}
