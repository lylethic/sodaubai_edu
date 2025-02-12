import React from 'react';
import StudentsList from './_components/student-list';

export default function StudentsPage() {
	return (
		<div className='block w-full overflow-x-auto'>
			<h1 className='text-2xl text-center uppercase p-2 border-b'>
				Danh sách học sinh
			</h1>
			<StudentsList />
		</div>
	);
}
