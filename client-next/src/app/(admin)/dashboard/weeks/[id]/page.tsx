import React, { cache } from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import envConfig from '@/config';
import { weekApiRequest } from '@/apiRequests/week';
import { baseOpenGraph } from '@/app/shared-metadata';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { formatDateToDDMMYYYY } from '@/lib/utils';

const getDetail = cache(weekApiRequest.weekDetail);

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
	const { payload } = await getDetail(Number(params.id), accessToken);

	const result = payload.data;
	const url = envConfig.NEXT_PUBLIC_URL + '/dashboard/weeks/' + result.weekId;
	return {
		title: result.weekName,
		openGraph: {
			...baseOpenGraph,
			title: result.weekName,
			url,
		},
		alternates: {
			canonical: url,
		},
	};
}

export default async function DetailWeekPage({
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
		console.log(result);
	} catch (error) {}

	return (
		<div className='flex flex-col items-center justify-center border rounded-xl mt-10'>
			<h1 className='text-center mt-4 text-lg uppercase font-bold p-2 border-b'>
				Chi tiết tuần học
			</h1>
			{!result && <div>Không tìm thấy thông tin!</div>}
			{result && (
				<div className='container'>
					<div className='flex justify-center items-center'>
						<Link
							href={'/dashboard/weeks'}
							className='flex justify-center items-center my-4'
						>
							<Button variant={'default'} type='button' title='Quay về'>
								<ArrowLeft />
								Quay về
							</Button>
						</Link>
						<Link
							href={`/dashboard/weeks/${result.weekId}/edit`}
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
								<TableCell>Mã tuần học</TableCell>
								<TableCell>{result.weekId}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Tên tuần</TableCell>
								<TableCell>{result.weekName}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Thời gian bắt đầu</TableCell>
								<TableCell>{formatDateToDDMMYYYY(result.weekStart)}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Thời gian kết thúc</TableCell>
								<TableCell>{formatDateToDDMMYYYY(result.weekEnd)}</TableCell>
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
