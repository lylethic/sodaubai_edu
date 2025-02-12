import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import TeacherUploadButton from './teacher-add-list-button';

export default function TeacherAddButton() {
	return (
		<div className='flex flex-col justify-center'>
			<Link href={'/dashboard/teachers/add'}>
				<Button
					type='button'
					variant={'default'}
					className='bg-green-700 text-white'
				>
					Thêm mới giáo viên
				</Button>
			</Link>
			<TeacherUploadButton />
		</div>
	);
}
