import React from 'react';
import SubjectsList from './_components/subject-list';

export default function SubjectsPage() {
	return (
		<div className='block w-full overflow-x-auto'>
			<h1 className='text-2xl text-center uppercase p-2 border-b'>
				Danh sách môn học
			</h1>
			<SubjectsList />
		</div>
	);
}
