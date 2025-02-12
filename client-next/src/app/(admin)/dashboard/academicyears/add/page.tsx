import React, { cache } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AcademicYearUpSertForm from '../_components/academic-year-upsert-form';

export default function AcademicYearAddPage() {
	return (
		<div className='flex flex-col items-center justify-center'>
			<h1 className='text-center mt-4 text-lg uppercase font-bold'>
				Tạo mới năm học
			</h1>
			<Link href={'/dashboard/academicyears'}>
				<Button variant={'default'} className='border my-4' title='Quay về'>
					<ArrowLeft />
				</Button>
			</Link>
			<AcademicYearUpSertForm />
		</div>
	);
}
