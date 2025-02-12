import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ClassifyUpSertForm from '../_components/classify-upsert-from';

export default function StudentAddPage() {
	return (
		<div className='flex flex-col items-center justify-center'>
			<h1 className='text-center mt-4 text-lg uppercase font-bold'>
				Tạo mới xếp loại
			</h1>
			<Link href={'/dashboard/xep-loai-tiet-hoc'}>
				<Button variant={'default'} className='border my-4' title='Quay về'>
					<ArrowLeft />
				</Button>
			</Link>
			<ClassifyUpSertForm />
		</div>
	);
}
