import React, { cache } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SemesterUpSertForm from '../_components/semester-upsert-form';

export default function SemesterAddPage() {
	return (
		<div className='flex flex-col items-center justify-center'>
			<h1 className='text-center mt-4 text-lg uppercase font-bold'>
				Tạo mới học kỳ
			</h1>
			<Link href={'/dashboard/semesters'}>
				<Button variant={'default'} className='border my-4' title='Quay về'>
					<ArrowLeft />
				</Button>
			</Link>
			<SemesterUpSertForm />
		</div>
	);
}
