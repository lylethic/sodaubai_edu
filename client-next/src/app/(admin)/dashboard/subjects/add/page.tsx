import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import SubjectUpSertForm from '../_components/subject-add-upsert-form';

export default function SubjectAddPage() {
	return (
		<div className='flex flex-col items-center justify-center'>
			<h1 className='text-center mt-4 text-lg uppercase font-bold'>
				Tạo mới môn học
			</h1>
			<Link href={'/dashboard/subjects'}>
				<Button variant={'default'} className='border my-4' title='Quay về'>
					<ArrowLeft />
				</Button>
			</Link>
			<SubjectUpSertForm />
		</div>
	);
}
