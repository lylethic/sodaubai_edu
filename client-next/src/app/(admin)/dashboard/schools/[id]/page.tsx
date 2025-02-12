import React, { cache } from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import envConfig from '@/config';
import { baseOpenGraph } from '@/app/shared-metadata';
import { formatDateToDDMMYYYY } from '@/lib/utils';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import schoolApiRequest from '@/apiRequests/school';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

const getDetail = cache(schoolApiRequest.getSchool);

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
		envConfig.NEXT_PUBLIC_URL + '/dashboard/schools/' + result.schoolId;

	return {
		title: result.nameSchool,
		openGraph: {
			...baseOpenGraph,
			title: result.nameSchool,
			url,
		},
		alternates: {
			canonical: url,
		},
	};
}

export default async function StudentAddPage({ params }: Props) {
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
				Chỉnh sửa trường học
			</h1>
			<div className='flex items-center justify-center'>
				<Link
					href={'/dashboard/schools'}
					className='flex justify-center items-center my-4'
				>
					<Button
						variant={'default'}
						type='button'
						title='Quay về'
						className='no-underline hover:no-underline'
					>
						<ArrowLeft />
						Quay về
					</Button>
				</Link>
				<Link href={`/dashboard/schools/${result?.schoolId}/edit`}>
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
								<TableCell>Mã trường học</TableCell>
								<TableCell>{result.schoolId}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Mã tỉnh thành</TableCell>
								<TableCell>{result.provinceId}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Mã huyện</TableCell>
								<TableCell>{result.districtId}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Tên trường học</TableCell>
								<TableCell>{result.nameSchool}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Địa chỉ trường học</TableCell>
								<TableCell>{result.address}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Số điện thoại</TableCell>
								<TableCell>{result.phoneNumber}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Phân loại trường</TableCell>
								<TableCell>{result.schoolType}</TableCell>
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
