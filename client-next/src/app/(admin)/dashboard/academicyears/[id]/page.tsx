import React, { cache } from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import envConfig from '@/config';
import { baseOpenGraph } from '@/app/shared-metadata';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { namHocApiRequest } from '@/apiRequests/namHoc';
import { formatDateToDDMMYYYY } from '@/lib/utils';

const getDetail = cache(namHocApiRequest.namHocDetail);

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
		envConfig.NEXT_PUBLIC_URL +
		'/dashboard/academicyears/' +
		result.academicYearId;

	return {
		title: 'Năm học ' + result.displayAcademicYearName,
		openGraph: {
			...baseOpenGraph,
			title: 'Năm học ' + result.displayAcademicYearName,
			url,
		},
		alternates: {
			canonical: url,
		},
	};
}

export default async function AcademicYearDetailPage({
	params,
}: {
	params: { id: string };
}) {
	const cookieStore = cookies();
	const token = cookieStore.get('accessToken');
	if (!token) return;
	let result = undefined;
	try {
		const { payload } = await getDetail(Number(params.id), token.value);
		result = payload.data;
	} catch (error) {}

	return (
		<div className='flex flex-col items-center justify-center border rounded-xl mt-10'>
			<h1 className='text-center mt-4 text-lg uppercase font-bold p-2 border-b'>
				Chi tiết năm học
			</h1>
			{!result && <div>Không tìm thấy thông tin!</div>}
			{result && (
				<div className='container'>
					<div className='flex justify-center w-full'>
						<Link
							href={'/dashboard/academicyears'}
							className='flex justify-center items-center my-4'
						>
							<Button variant={'default'} type='button' title='Quay về'>
								<ArrowLeft />
								Quay về
							</Button>
						</Link>
						<Link
							href={`/dashboard/academicyears/${result.academicYearId}/edit`}
							className='flex justify-center items-center my-4'
						>
							<Button
								variant={'outline'}
								type='button'
								title='Chỉnh sửa'
								className='bg-yellow-400 text-black ms-2'
							>
								Chỉnh sửa
								<ArrowRight />
							</Button>
						</Link>
					</div>
					<Table className='border'>
						<TableBody>
							<TableRow>
								<TableCell>Mã năm học</TableCell>
								<TableCell>{result.academicYearId}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Tên hiển thị năm học</TableCell>
								<TableCell>{result.displayAcademicYearName}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Thời gian bắt đầu</TableCell>
								<TableCell>{formatDateToDDMMYYYY(result.yearStart)}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Thời gian kết thúc</TableCell>
								<TableCell>{formatDateToDDMMYYYY(result.yearEnd)}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Trạng thái</TableCell>
								<TableCell>
									{result.status ? (
										<Button className='bg-green-500' variant={'default'}>
											Hoạt động
										</Button>
									) : (
										<Button className='bg-red-500' variant={'default'}>
											Ngưng họat động
										</Button>
									)}
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>
			)}
		</div>
	);
}
