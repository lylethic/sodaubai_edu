import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function GradeAddButton() {
	return (
		<div className='my-4'>
			<Link href={'/dashboard/grades/add'}>
				<Button type='button' variant={'default'} className='bg-green-700'>
					<PlusCircle />
					Thêm mới
				</Button>
			</Link>
		</div>
	);
}
