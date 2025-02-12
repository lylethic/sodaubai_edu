import { lopHocApiRequest } from '@/apiRequests/lopHoc';
import { cookies } from 'next/headers';
import React, { cache } from 'react';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { Metadata, ResolvingMetadata } from 'next';
import envConfig from '@/config';
import { baseOpenGraph } from '@/app/shared-metadata';

type Props = {
	params: { id: string };
	searchParams: { [key: string]: string | string[] | undefined };
};

const getDetailLopHoc = cache(lopHocApiRequest.class);

export async function generateMetadata(
	{ params, searchParams }: Props,
	parent: ResolvingMetadata
): Promise<Metadata> {
	const cookieStore = cookies();
	const accessToken = cookieStore.get('accessToken')!.value;
	const { payload } = await getDetailLopHoc(Number(params.id), accessToken);

	const result = payload.data;
	const url =
		envConfig.NEXT_PUBLIC_URL + '/dashboard/classes/' + result.classId;
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

export default async function LopHocDetailPage(props: Props) {
	const params = props.params;
	const cookieStore = cookies();
	const token = cookieStore.get('accessToken');
	if (!token)
		return (
			Response.json({
				message: 'Invalid token',
			}),
			{
				status: 400,
			}
		);
	let result = null;

	try {
		const { payload } = await getDetailLopHoc(Number(params.id), token?.value);
		result = payload.data;
	} catch (error) {}

	return (
		<div className='p-4 flex flex-col items-center overflow-x-auto border mb-4'>
			<h1 className='flex items-center h-[40px] my-4 text-lg uppercase font-bold'>
				Chi tiết lớp học
			</h1>
			<Link href='/dashboard/classes'>
				<Button variant={'default'}>
					<ArrowLeft />
				</Button>
			</Link>
			{!result ? (
				<span>Không có dữ liệu</span>
			) : (
				<Table className='min-w-fullrounded-lg shadow'>
					<TableBody>
						<TableRow>
							<TableCell>Mã trường học</TableCell>
							<TableCell>{result.schoolId}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Trường học</TableCell>
							<TableCell>{result.schoolName}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Năm học</TableCell>
							<TableCell>{result.nienKhoa}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Giáo viên</TableCell>
							<TableCell>{result.teacherName}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Mã khối lóp</TableCell>
							<TableCell>{result.gradeId}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Khối lớp</TableCell>
							<TableCell>{result.gradeName}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Mã lớp học</TableCell>
							<TableCell>{result.classId}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Lớp học</TableCell>
							<TableCell>{result.className}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Ghi chú</TableCell>
							<TableCell>{result.description}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Trạng thái</TableCell>
							<TableCell>
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
							<TableCell>Ngày tạo</TableCell>
							<TableCell>{result.dateCreated?.toString()}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Ngày cập nhật</TableCell>
							<TableCell>{result.dateUpdated?.toString()}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			)}
		</div>
	);
}
