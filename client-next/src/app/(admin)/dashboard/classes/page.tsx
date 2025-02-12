import React from 'react';
import ClassesList from './_components/classes-list';

export default function ClassesPage() {
	return (
		<div className='block w-full overflow-x-auto'>
			<h1 className='text-xl text-center uppercase p-2 border-b'>
				Danh sách lớp học
			</h1>
			<ClassesList />
		</div>
	);
}
