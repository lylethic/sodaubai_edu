import React, { cache } from 'react';
import { cookies } from 'next/headers';
import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import envConfig from '@/config';
import { baseOpenGraph } from '@/app/shared-metadata';
import { ArrowLeft, ArrowRight, Ban, Check } from 'lucide-react';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { subjectApiRequest } from '@/apiRequests/subject';
import { formatDateToDDMMYYYY } from '@/lib/utils';

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
		title: 'Chi tiết môn ' + subjectName,
		openGraph: {
			...baseOpenGraph,
			title: 'Chi tiết môn ' + subjectName,
			url,
		},
		alternates: {
			canonical: url,
		},
	};
}

export default async function SubjectDetailPage({ params }: Props) {
	const cookieStore = cookies();
	const token = cookieStore.get('accessToken');
	if (!token) return null;

	let result = null;
	try {
		const { payload } = await getDetail(Number(params.id), token.value);
		result = payload.data;
	} catch (error) {}

	const subjectId = result?.id ?? result?.subjectId;
	const subjectName = result?.name ?? result?.subjectName;

	return (
		<div className='flex flex-col items-center justify-center border rounded-xl mt-10'>
			<h1 className='text-center mt-4 text-lg uppercase font-bold p-2 border-b'>
				Chi tiết môn học
			</h1>
			<div className='flex items-center justify-center'>
				<Link
					href={'/dashboard/subjects'}
					className='flex justify-center items-center my-4'
				>
					<Button variant={'default'} type='button' title='Quay về'>
						<ArrowLeft />
						Quay về
					</Button>
				</Link>
				{subjectId && (
					<Link href={`/dashboard/subjects/${subjectId}/edit`}>
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
				)}
			</div>
			{!result && <div>Không có thông tin!</div>}
			{result && (
				<div className='container'>
					<Table className='border shadow'>
						<TableBody>
							<TableRow>
								<TableCell>Mã môn học</TableCell>
								<TableCell className='font-bold'>{subjectId}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Tên hiển thị môn học</TableCell>
								<TableCell className='font-medium'>
									{subjectName}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Năm học</TableCell>
								<TableCell className='font-medium'>
									{result.displayAcademicYear_Name}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Thời gian năm học bắt đầu</TableCell>
								<TableCell className='font-medium'>
									{formatDateToDDMMYYYY(result.yearStart)}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Thời gian năm học kết thúc</TableCell>
								<TableCell className='font-medium'>
									{formatDateToDDMMYYYY(result.yearEnd)}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Mã khối</TableCell>
								<TableCell className='font-medium'>{result.gradeId}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Khối lớp</TableCell>
								<TableCell className='font-medium'>
									{result.gradeName}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Ghi chú</TableCell>
								<TableCell className='font-medium'>
									{result.description}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Trạng thái</TableCell>
								<TableCell className='font-medium'>
									{result.status === true ? (
										<Button
											variant={'default'}
											className='bg-green-700'
											type='button'
										>
											Hoạt động <Check />
										</Button>
									) : (
										<Button
											variant={'default'}
											className='bg-red-700'
											type='button'
										>
											Ngưng hoạt động <Ban />
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
