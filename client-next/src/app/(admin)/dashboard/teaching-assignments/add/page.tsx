import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import TeachingAssignmentUpSert from '../_components/upsert';

export default function TeachingAssignmentAddPage() {
	return (
		<div className='flex flex-col items-center justify-center'>
			<h1 className='text-center mt-4 text-lg uppercase font-bold'>
				Phân công lớp giảng dạy
			</h1>
			<Link href={'/dashboard/teaching-assignments'}>
				<Button variant={'default'} className='border my-4' title='Quay về'>
					<ArrowLeft />
				</Button>
			</Link>
			<TeachingAssignmentUpSert />
		</div>
	);
}
