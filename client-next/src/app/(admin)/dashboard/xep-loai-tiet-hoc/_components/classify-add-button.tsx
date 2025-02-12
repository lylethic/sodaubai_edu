import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function ClassifyAddButton() {
	return (
		<div className='my-4'>
			<Link href={'/dashboard/xep-loai-tiet-hoc/add'}>
				<Button type='button' variant={'default'} className='bg-green-700'>
					<PlusCircle />
					Thêm mới
				</Button>
			</Link>
		</div>
	);
}
