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
import { phanCongGiangDayApiRequest } from '@/apiRequests/phanCongGiangDay';

const getDetail = cache(phanCongGiangDayApiRequest.phanCongGiangDay);

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
		'/dashboard/teaching-assignments/' +
		result.phanCongGiangDayId;

	return {
		title:
			'Phân công giáo viên' + result.fullname + 'dạy lớp' + result.className,
		openGraph: {
			...baseOpenGraph,
			title:
				'Phân công giáo viên' + result.fullname + 'dạy lớp' + result.className,
			url,
		},
		alternates: {
			canonical: url,
		},
	};
}

export default async function TeahingAssignmentsDetailPage({
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
				Chi tiết phân công giảng dạy
			</h1>
			{!result && <div>Không tìm thấy thông tin!</div>}
			{result && (
				<div className='container'>
					<div className='flex justify-center w-full'>
						<Link
							href={'/dashboard/teaching-assignments'}
							className='flex justify-center items-center my-4'
						>
							<Button variant={'default'} type='button' title='Quay về'>
								<ArrowLeft />
								Quay về
							</Button>
						</Link>
						<Link
							href={`/dashboard/teaching-assignments/${result.phanCongGiangDayId}/edit`}
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
								<TableCell>Mã phân công</TableCell>
								<TableCell>{result.phanCongGiangDayId}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Mã sổ đầu bài</TableCell>
								<TableCell>{result.biaSoDauBaiId}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Mã giáo viên</TableCell>
								<TableCell>{result.teacherId}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Tên lớp hiển thị</TableCell>
								<TableCell>{result.className}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Thời gian bắt đầu</TableCell>
								<TableCell>
									{formatDateToDDMMYYYY(result.dateCreated)}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Thời gian kết thúc</TableCell>
								<TableCell>
									{formatDateToDDMMYYYY(result.dateUpdated)}
								</TableCell>
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
