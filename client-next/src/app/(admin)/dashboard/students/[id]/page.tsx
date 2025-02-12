import React, { cache } from 'react';
import { cookies } from 'next/headers';
import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import envConfig from '@/config';
import { baseOpenGraph } from '@/app/shared-metadata';
import { studentApiRequest } from '@/apiRequests/student';
import { ArrowLeft, ArrowRight, Ban, Check } from 'lucide-react';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { formatDateToDDMMYYYY } from '@/lib/utils';

const getDetail = cache(studentApiRequest.student);

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
		envConfig.NEXT_PUBLIC_URL + '/dashboard/students/' + result.studentId;

	return {
		title: 'Chi tiết học sinh ' + result.fullname,
		openGraph: {
			...baseOpenGraph,
			title: 'Chi tiết học sinh ' + result.fullname,
			url,
		},
		alternates: {
			canonical: url,
		},
	};
}

export default async function DetailPage({ params }: Props) {
	const cookieStore = cookies();
	const token = cookieStore.get('accessToken');
	if (!token) return;

	let result = null;
	try {
		const { payload } = await getDetail(Number(params.id), token.value);
		result = payload.data;
		console.log(result);
	} catch (error) {}

	return (
		<div className='flex flex-col items-center justify-center border rounded-xl mt-10'>
			<h1 className='text-center mt-4 text-lg uppercase font-bold p-2 border-b'>
				Chi tiết học sinh
			</h1>
			<div className='flex items-center justify-center'>
				<Link
					href={'/dashboard/students'}
					className='flex justify-center items-center my-4'
				>
					<Button variant={'default'} type='button' title='Quay về'>
						<ArrowLeft />
						Quay về
					</Button>
				</Link>
				<Link href={`/dashboard/students/${result?.studentId}/edit`}>
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
			{!result && <div>Không có thông tin!</div>}
			{result && (
				<div className='container'>
					<Table className='border shadow'>
						<TableBody>
							<TableRow>
								<TableCell>Mã học sinh</TableCell>
								<TableCell className='font-bold'>{result.studentId}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Mã tài khoản</TableCell>
								<TableCell className='font-medium'>
									{result.accountId}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Mã trường học</TableCell>
								<TableCell className='font-medium'>{result.schoolId}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Mã lớp học</TableCell>
								<TableCell className='font-medium'>{result.classId}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Tên lớp</TableCell>
								<TableCell className='font-medium'>
									{result.className}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Email</TableCell>
								<TableCell className='font-medium'>{result.email}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Họ và tên</TableCell>
								<TableCell className='font-medium'>{result.fullname}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Ngày sinh</TableCell>
								<TableCell>
									{formatDateToDDMMYYYY(result.dateOfBirth)}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Địa chỉ hiện tại</TableCell>
								<TableCell className='font-medium'>{result.address}</TableCell>
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
										<Button
											aria-readonly
											className='flex bg-red-500 text-white'
										>
											<Ban /> Ngưng hoạt động
										</Button>
									)}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Ngày tạo</TableCell>
								<TableCell>
									{formatDateToDDMMYYYY(result.dateCreated)}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Ngày cập nhật</TableCell>
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
