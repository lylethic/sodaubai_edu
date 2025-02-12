import React, { cache } from 'react';
import { xepLoaiApiRequest } from '@/apiRequests/xeploaiTiethoc';
import { cookies } from 'next/headers';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ClassifyUpSertForm from '../../_components/classify-upsert-from';
import Link from 'next/link';

const getDetail = cache(xepLoaiApiRequest.xeploai);

type Props = {
	params: { id: string };
	searchParams: { [key: string]: string | string[] | undefined };
};

export default async function ClassifyEditPage({ params }: Props) {
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
		<div className='flex flex-col items-center justify-center'>
			<h1 className='text-center mt-4 text-lg uppercase font-bold'>
				Chỉnh sửa xếp loại
			</h1>
			<Link href={'/dashboard/xep-loai-tiet-hoc'}>
				<Button variant={'default'} className='border my-4' title='Quay về'>
					<ArrowLeft />
				</Button>
			</Link>
			{!result && <div>Không tìm thấy thông tin!</div>}
			{result && <ClassifyUpSertForm classify={result} />}
		</div>
	);
}
