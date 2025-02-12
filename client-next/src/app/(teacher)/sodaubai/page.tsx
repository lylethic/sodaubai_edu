import React from 'react';
import SoDauBaiListPage from './_components/bia-sodaubai-list';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function SoDauBaiPage() {
	return (
		<div>
			<h1 className='text-lg uppercase text-center p-2 border-b'>
				danh sách sổ đầu bài
			</h1>
			<Link href='/'>
				<Button
					type='button'
					variant={'default'}
					className='bg-blue-700 text-white capitalize'
				>
					<Home />
					trang chủ
				</Button>
			</Link>
			<SoDauBaiListPage />
		</div>
	);
}
