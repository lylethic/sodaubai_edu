import React from 'react';
import RollCallList from './_components/roll-call-list';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function RollCallPage({
	searchParams,
}: {
	searchParams?: { [key: string]: string | string[] | undefined };
}) {
	const weekId = searchParams?.weekId ? Number(searchParams.weekId) : null;
	const classId = searchParams?.classId ? Number(searchParams.classId) : null;

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

			<RollCallList filters={{ weekId, classId }} />
		</div>
	);
}
