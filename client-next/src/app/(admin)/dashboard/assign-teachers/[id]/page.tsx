import React, { cache, Suspense } from 'react';
import { cookies } from 'next/headers';
import { Metadata, ResolvingMetadata } from 'next';
import envConfig from '@/config';
import { baseOpenGraph } from '@/app/shared-metadata';
import { PhanCongChuNhiemApiRequest } from '@/apiRequests/phanCongChuNhiem';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { formatDateToDDMMYYYY } from '@/lib/utils';

const getDetail = cache(PhanCongChuNhiemApiRequest.phanCong);

type Props = {
	params: { id: string };
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
	{ params, searchParams }: Props,
	parent: ResolvingMetadata
): Promise<Metadata> {
	const cookieStore = cookies();
	const accessToken = cookieStore.get('accessToken')!.value;
	const { payload } = await getDetail(Number(params.id), accessToken);

	const account = payload.data;
	const url =
		envConfig.NEXT_PUBLIC_URL +
		'/dashboard/assign-teachers/' +
		account.phanCongChuNhiemId;
	return {
		title: 'Chủ nhiệm ' + account.nameClass,
		openGraph: {
			...baseOpenGraph,
			title: account.nameClass,
			url,
		},
		alternates: {
			canonical: url,
		},
	};
}

export default async function AssignTeacherDetailPage({ params }: Props) {
	const cookieStore = cookies();
	const token = cookieStore.get('accessToken');
	if (!token) return;
	let result = null;
	try {
		const { payload } = await getDetail(Number(params.id), token.value);
		result = payload.data;
	} catch (error) {}

	return (
		<div className='p-4 flex flex-col items-center overflow-x-auto border rounded-xl mb-4'>
			<h1 className='text-center font-bold my-2 text-lg uppercase border-b'>
				<span>Chi tiết nội dung</span>
				<br /> phân công chủ nhiệm
			</h1>
			<div className='container'>
				<div className='flex items-center justify-center'>
					<Link
						href='/dashboard/assign-teachers'
						className='flex justify-center items-center my-4'
					>
						<Button variant={'default'} type='button' title='Quay về'>
							<ArrowLeft /> Quay về
						</Button>
					</Link>
					<Link
						href={`/dashboard/assign-teachers/${result?.phanCongChuNhiemId}/edit`}
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
			</div>
			{!result ? (
				<span>Không có dữ liệu</span>
			) : (
				<Table className='border shadow'>
					<TableBody>
						<TableRow>
							<TableCell className='font-medium'>
								Mã phân công chủ nhiện
							</TableCell>
							<TableCell className='font-bold'>
								{result.phanCongChuNhiemId}
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className='font-medium'>Mã trường học</TableCell>
							<TableCell className='font-medium'>{result.schoolId}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className='font-medium'>Trường học</TableCell>
							<TableCell className='font-medium'>{result.schoolName}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className='font-medium'>Năm học</TableCell>
							<TableCell className='font-medium'>
								{result.academicYearName}
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className='font-medium'>Giáo viên</TableCell>
							<TableCell className='font-medium'>
								{result.teacherName}
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className='font-medium'>Mã khối lóp</TableCell>
							<TableCell className='font-medium'>{result.gradeId}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className='font-medium'>Mã lớp học</TableCell>
							<TableCell className='font-medium'>{result.classId}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className='font-medium'>Lớp học</TableCell>
							<TableCell className='font-medium'>{result.nameClass}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className='font-medium'>Ghi chú</TableCell>
							<TableCell className='font-medium'>
								{result.description}
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className='font-medium'>Trạng thái</TableCell>
							<TableCell className='font-medium'>
								{result.status ? (
									<Button
										aria-readonly
										className='flex bg-green-500 text-white'
									>
										<Check /> Hoạt động
									</Button>
								) : (
									<Button aria-readonly className='flex bg-gray-500'>
										<Check /> Ngưng hoạt động
									</Button>
								)}
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className='font-medium'>Ngày tạo</TableCell>
							<TableCell className='font-medium'>
								{formatDateToDDMMYYYY(result.dateCreated)}
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className='font-medium'>Ngày cập nhật</TableCell>
							<TableCell className='font-medium'>
								{formatDateToDDMMYYYY(result.dateUpdated)}
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			)}
		</div>
	);
}
