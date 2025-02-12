// This is SoDauBai Details component.

import React, { cache } from 'react';

import envConfig from '@/config';
import { cookies } from 'next/headers';
import { Metadata, ResolvingMetadata } from 'next';
import { baseOpenGraph } from '@/app/shared-metadata';
import biaSoDauBaiApiRequest from '@/apiRequests/biasodaubai';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const biaSoDauBaiDetails = cache(biaSoDauBaiApiRequest.getDetail);

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
	const { payload } = await biaSoDauBaiDetails(Number(params.id), accessToken);

	const result = payload.data;
	const url =
		envConfig.NEXT_PUBLIC_URL +
		'/dashboard/biasodaubais/' +
		result.biaSoDauBaiId;
	return {
		title: result.className,
		openGraph: {
			...baseOpenGraph,
			title: result.className,
			url,
		},
		alternates: {
			canonical: url,
		},
	};
}

export default async function BiaSoDauBaiDetailsPage({ params }: Props) {
	const cookieStore = cookies();
	const token = cookieStore.get('accessToken');
	if (!token) {
		return (
			Response.json({
				message: 'Invalid token',
			}),
			{
				status: 400,
			}
		);
	}

	let biaSoDauBai = null;
	try {
		const { payload } = await biaSoDauBaiDetails(
			Number(params.id),
			token.value
		);
		biaSoDauBai = payload.data;
	} catch (error) {}

	return (
		<div>
			{!biaSoDauBai ? (
				<span>Không có dữ liệu</span>
			) : (
				<div className='p-4 flex flex-col items-center overflow-x-auto border mb-4'>
					<h1 className='flex items-center h-[40px] my-4 text-lg uppercase font-bold'>
						Chi tiết bìa sổ đầu bài
					</h1>
					<Table className='min-w-fullrounded-lg shadow'>
						<TableBody>
							<TableRow>
								<TableCell>Mã bìa sổ đâu bài</TableCell>
								<TableCell>{biaSoDauBai.biaSoDauBaiId}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Mã trường học</TableCell>
								<TableCell>{biaSoDauBai.schoolId}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Trường học</TableCell>
								<TableCell>{biaSoDauBai.schoolName}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Mã năm học</TableCell>
								<TableCell>{biaSoDauBai.academicyearId}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Năm học</TableCell>
								<TableCell>{biaSoDauBai.nienKhoaName}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Mã lớp học</TableCell>
								<TableCell>{biaSoDauBai.classId}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Lớp học</TableCell>
								<TableCell>{biaSoDauBai.className}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Giáo viên chủ nhiệm</TableCell>
								<TableCell>{biaSoDauBai.tenGiaoVienChuNhiem}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Trạng thái</TableCell>
								<TableCell>
									{biaSoDauBai.status ? (
										<Button
											aria-readonly
											className='flex bg-green-500 text-white'
										>
											<Check /> Hoạt động
										</Button>
									) : (
										'Ngưng hoạt động'
									)}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Ngày tạo</TableCell>
								<TableCell>{biaSoDauBai.dateCreated}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Ngày cập nhật</TableCell>
								<TableCell>{biaSoDauBai.dateUpdated}</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>
			)}
			<Link href={'/dashboard/sodaubais'}>
				<Button
					variant={'link'}
					className='bg-blue-600 text-white no-underline hover:no-underline'
				>
					Quay về
				</Button>
			</Link>
		</div>
	);
}
