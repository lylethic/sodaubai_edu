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
	if (!token) return null;
	let result = null;

	try {
		const { payload } = await getDetail(Number(params.id), token.value);
		result = payload.data;
	} catch (error) {}

	const detailId = result?.id ?? result?.classificationId;
	const detailName = result?.name ?? result?.classifyName;

	return (
		<div className='flex flex-col items-center justify-center border rounded-xl mt-10'>
			<h1 className='text-center mt-4 text-lg uppercase font-bold p-2 border-b'>
				Chi tiết điểm xếp loại
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
				{detailId && (
					<Link href={`/dashboard/xep-loai-tiet-hoc/${detailId}/edit`}>
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
			{!result && <div>Không tìm thấy thông tin!</div>}
			{result && (
				<div className='container overflow-x-auto p-4'>
					<Table className='border shadow'>
						<TableBody>
							<TableRow>
								<TableCell>Mã xếp loại</TableCell>
								<TableCell>{detailId}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Tên hiển thị</TableCell>
								<TableCell>{detailName}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Số điểm</TableCell>
								<TableCell>{result.score ?? 0}</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>
			)}
		</div>
	);
}
