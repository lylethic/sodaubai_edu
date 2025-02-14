import React from 'react';
import TeachingAssignmentList from './_components/teaching-assignment-list';

export default function TeachingAssignmentPage() {
	return (
		<div className='block w-full overflow-x-auto'>
			<h1 className='text-xl text-center uppercase p-2 border-b'>
				danh sách phân công giảng dạy
			</h1>
			<TeachingAssignmentList />
		</div>
	);
}
