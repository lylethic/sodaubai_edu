import React from 'react';
import SchoolsList from './_components/school-list';

export default function SchoolsPage() {
	return (
		<div className='block w-full overflow-x-auto'>
			<h1 className='text-2xl text-center uppercase p-2 border-b'>
				Danh sách trường học
			</h1>
			<SchoolsList />
		</div>
	);
}
