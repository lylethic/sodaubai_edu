import React, { cache } from 'react';

import envConfig from '@/config';
import { cookies } from 'next/headers';
import { Metadata, ResolvingMetadata } from 'next';
import { baseOpenGraph } from '@/app/shared-metadata';
import biaSoDauBaiApiRequest from '@/apiRequests/biasodaubai';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';

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
	const url = envConfig.NEXT_PUBLIC_URL + '/sodaubai/' + result.biaSoDauBaiId;
	return {
		title: result.className,
		openGraph: {
			...baseOpenGraph,
			title: result.className,
			url: url,
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
		<div className='flex flex-col items-center justify-center border rounded-xl mt-10'>
			<h1 className='text-center mt-4 text-lg uppercase font-bold p-2 border-b'>
				Chi tiết bìa sổ đầu bài
			</h1>
			<div className='flex items-center justify-center'>
				<Link
					href={'/sodaubai'}
					className='flex justify-center items-center my-4'
				>
					<Button
						variant={'default'}
						className='no-underline hover:no-underline'
					>
						<ArrowLeft /> Quay về
					</Button>
				</Link>
			</div>
			{!biaSoDauBai ? (
				<span>Không có dữ liệu</span>
			) : (
				<div className='container'>
					<Table className='shadow'>
						<TableBody className='font-medium'>
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
		</div>
	);
}
