import React, { cache } from 'react';
import ChiTietSoDauBai from '../../_components/chi-tiet-sodaubai';
import { phanCongGiangDayApiRequest } from '@/apiRequests/phanCongGiangDay';
import { cookies } from 'next/headers';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const getInfoByBia = cache(phanCongGiangDayApiRequest.getPhanCongByBia);

type Props = {
	params: { id: string };
	searchParams: { [key: string]: string | string[] | undefined };
};

export default async function ChiTietSoDauBaiPage({ params }: Props) {
	const cookieStore = cookies();
	const token = cookieStore.get('accessToken');

	let result = null;
	if (!token) return;

	try {
		const { payload } = await getInfoByBia(Number(params.id), token.value);
		result = payload.data;
	} catch (error) {}

	return (
		<>
			<h1 className='font-medium text-lg text-center uppercase my-4'>
				chi tiết sổ đầu bài
			</h1>
			{!result ? (
				<span>...</span>
			) : (
				<Card>
					<CardHeader>
						<CardTitle>Thông tin lớp học</CardTitle>
					</CardHeader>
					<CardContent>
						<p>{result.className}</p>
						<p>Giáo viên chủ nhiệm: {result.fullname}</p>
						<p>
							Trạng thái:{' '}
							{result.status ? (
								<Button type='button' className='bg-green-500 text-white'>
									Hoạt động <Check />
								</Button>
							) : (
								<Button type='button' className='bg-red-500 text-white'>
									Ngưng hoạt động <X />
								</Button>
							)}
						</p>
					</CardContent>
				</Card>
			)}
			<ChiTietSoDauBai />
		</>
	);
}
