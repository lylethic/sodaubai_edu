import React, { cache } from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import envConfig from '@/config';
import { baseOpenGraph } from '@/app/shared-metadata';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { formatDateToDDMMYYYY } from '@/lib/utils';
import { semesterApiRequest } from '@/apiRequests/semester';

const getDetail = cache(semesterApiRequest.semester);

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
		envConfig.NEXT_PUBLIC_URL + '/dashboard/semesters/' + result.academicYearId;

	return {
		title: result.semesterName,
		openGraph: {
			...baseOpenGraph,
			title: result.semesterName,
			url,
		},
		alternates: {
			canonical: url,
		},
	};
}

export default async function SemesterDetailPage({
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
				Chi tiết học kỳ
			</h1>
			{!result && <div>Không tìm thấy thông tin!</div>}
			{result && (
				<div className='container'>
					<div className='flex justify-center'>
						<Link
							href={'/dashboard/semesters'}
							className='flex justify-center items-center my-4'
						>
							<Button variant={'default'} type='button' title='Quay về'>
								<ArrowLeft />
								Quay về
							</Button>
						</Link>
						<Link
							href={`/dashboard/semesters/${result.semesterId}/edit`}
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
								<TableCell className='font-medium'>Mã năm học</TableCell>
								<TableCell className='font-medium'>
									{result.academicYearId}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell className='font-medium'>
									Tên hiển thị năm học
								</TableCell>
								<TableCell className='font-medium'>
									{result.displayAcademicYearName}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell className='font-medium'>Mã học kỳ</TableCell>
								<TableCell className='font-medium'>
									{result.semesterId}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell className='font-medium'>
									Tên hiển thị học kỳ
								</TableCell>
								<TableCell className='font-medium'>
									{result.semesterName}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell className='font-medium'>
									Thời gian học kỳ bắt đầu
								</TableCell>
								<TableCell className='font-medium'>
									{formatDateToDDMMYYYY(result.dateStart)}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell className='font-medium'>
									Thời gian học kỳ kết thúc
								</TableCell>
								<TableCell className='font-medium'>
									{formatDateToDDMMYYYY(result.dateEnd)}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell className='font-medium'>
									Thời gian năm học bắt đầu
								</TableCell>
								<TableCell className='font-medium'>
									{formatDateToDDMMYYYY(result.yearStart)}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell className='font-medium'>
									Thời gian năm học kết thúc
								</TableCell>
								<TableCell className='font-medium'>
									{formatDateToDDMMYYYY(result.yearEnd)}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell className='font-medium'>Trạng thái học kỳ</TableCell>
								<TableCell className='font-medium'>
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
