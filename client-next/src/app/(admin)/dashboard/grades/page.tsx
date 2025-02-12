import React from 'react';
import GradesList from './_components/grades-list';

export default function GradePage() {
	return (
		<div className='block w-full overflow-x-auto'>
			<h1 className='text-2xl text-center uppercase p-2 border-b'>
				Danh sách khối lớp
			</h1>
			<GradesList />
		</div>
	);
}
