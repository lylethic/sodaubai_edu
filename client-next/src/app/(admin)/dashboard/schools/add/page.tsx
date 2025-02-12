import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import SchoolUpSertForm from '../_components/school-upsert-form';

export default function StudentAddPage() {
	return (
		<div className='flex flex-col items-center justify-center'>
			<h1 className='text-center mt-4 text-lg uppercase font-bold'>
				Tạo mới trường học
			</h1>
			<Link href={'/dashboard/schools'}>
				<Button variant={'default'} className='border my-4' title='Quay về'>
					<ArrowLeft />
				</Button>
			</Link>
			<SchoolUpSertForm />
		</div>
	);
}
