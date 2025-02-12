import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import GradeUpSertForm from '../_components/grade-upsert.form';

export default function GradeAddPage() {
	return (
		<div className='flex flex-col items-center justify-center'>
			<h1 className='text-center mt-4 text-lg uppercase font-bold'>
				Tạo mới khối lớp
			</h1>
			<Link href={'/dashboard/grades'}>
				<Button variant={'default'} className='border my-4' title='Quay về'>
					<ArrowLeft />
				</Button>
			</Link>
			<GradeUpSertForm />
		</div>
	);
}
