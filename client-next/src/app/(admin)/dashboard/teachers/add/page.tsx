import React from 'react';
import TeacherAddForm from '../_components/teacher-add-form';

export default function TeacherAddPage() {
	return (
		<div className='mt-6'>
			<h1 className='text-center text-lg font-medium p-4 uppercase'>
				Thêm mới giáo viên
			</h1>
			<TeacherAddForm />
		</div>
	);
}
