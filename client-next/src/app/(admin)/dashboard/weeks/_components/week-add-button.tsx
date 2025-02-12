import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, PlusCircle } from 'lucide-react';

export default function WeekAddButton() {
	return (
		<div className='my-2'>
			<Link href={'/dashboard/weeks/add'} className='my-4'>
				<Button
					variant={'default'}
					className='font-medium bg-green-700 text-white'
				>
					<PlusCircle />
					Thêm mới
				</Button>
			</Link>
		</div>
	);
}
