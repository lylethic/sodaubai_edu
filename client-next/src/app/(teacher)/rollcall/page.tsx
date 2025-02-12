import React from 'react';
import RollCallList from './_components/roll-call-list';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function RollCallPage() {
	return (
		<div>
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
			<h1 className='text-lg uppercase text-center p-2 border-b'>
				danh sách điểm danh
			</h1>

			<RollCallList />
		</div>
	);
}
