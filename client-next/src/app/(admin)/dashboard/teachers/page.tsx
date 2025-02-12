import React from 'react';
import { TeacherList } from './_components/teacher-list';
import TeacherAddButton from './_components/teacher-add-button';

export default function TeachersList() {
	return (
		<div className='block w-full overflow-x-auto'>
			<h1 className='text-2xl text-center uppercase p-2 border-b'>
				Danh sách giáo viên
			</h1>
			<TeacherAddButton />
			<TeacherList />
		</div>
	);
}
