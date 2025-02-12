import React from 'react';
import SemestersList from './_components/semesters-list';

export default function SemestersPage() {
	return (
		<div className='block w-full overflow-x-auto'>
			<h1 className='text-xl text-center uppercase p-2 border-b'>
				Danh sách học kỳ
			</h1>
			<SemestersList />
		</div>
	);
}
