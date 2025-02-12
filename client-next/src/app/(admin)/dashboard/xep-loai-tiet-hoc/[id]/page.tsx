import React, { cache } from 'react';
import { xepLoaiApiRequest } from '@/apiRequests/xeploaiTiethoc';
import { cookies } from 'next/headers';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const getDetail = cache(xepLoaiApiRequest.xeploai);

type Props = {
	params: { id: string };
	searchParams: { [key: string]: string | string[] | undefined };
};

export default async function ClassifyPage({ params }: Props) {
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
					href={'/dashboard/xep-loai-tiet-hoc'}
					className='flex justify-center items-center my-4'
				>
					<Button variant={'default'} type='button' title='Quay về'>
						<ArrowLeft />
						Quay về
					</Button>
				</Link>
				<Link
					href={`/dashboard/xep-loai-tiet-hoc/${result?.classificationId}/edit`}
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
			{!result && <div>Không tìm thấy thông tin!</div>}
			{result && (
				<div className='container overflow-x-auto p-4'>
					<Table className='border shadow'>
						<TableBody>
							<TableRow>
								<TableCell>Mã xếp loại</TableCell>
								<TableCell>{result.classificationId}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Tên hiển thị</TableCell>
								<TableCell>{result.classifyName}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Số điểm</TableCell>
								<TableCell>{result.score}</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>
			)}
		</div>
	);
}
