import React, { cache } from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';
import envConfig from '@/config';
import { baseOpenGraph } from '@/app/shared-metadata';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { gradeApiRequest } from '@/apiRequests/grade';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { formatDateToDDMMYYYY } from '@/lib/utils';

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
			<div className='flex items-center justify-center'>
				<Link
					href={'/dashboard/grades'}
					className='flex justify-center items-center my-4'
				>
					<Button variant={'default'} type='button' title='Quay về'>
						<ArrowLeft />
						Quay về
					</Button>
				</Link>
				<Link href={`/dashboard/grades/${result?.gradeId}/edit`}>
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
			{!result && <div>Không tìm thấy thông tin!</div>}
			{result && (
				<div className='container'>
					<Table className='border shadow'>
						<TableBody>
							<TableRow>
								<TableCell>Mã khối lớp</TableCell>
								<TableCell>{result.gradeId}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Mã năm học</TableCell>
								<TableCell>{result.academicYearId}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Năm học</TableCell>
								<TableCell>{result.displayAcademicYearName}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Thời gian năm học bắt đầu</TableCell>
								<TableCell>{formatDateToDDMMYYYY(result.yearStart)}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Thời gian năm học kết thúc</TableCell>
								<TableCell>{formatDateToDDMMYYYY(result.yearEnd)}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Ghi chú</TableCell>
								<TableCell>{result.description}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Ngày tạo</TableCell>
								<TableCell>
									{formatDateToDDMMYYYY(result.dateCreated)}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Thời gian cập nhật gần đây</TableCell>
								<TableCell>
									{formatDateToDDMMYYYY(result.dateUpdated)}
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>
			)}
		</div>
	);
}
