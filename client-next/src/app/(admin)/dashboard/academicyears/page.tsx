import React from 'react';
import SchoolYearsList from './_components/acdemic-years.list';

export default function SchoolYears() {
	return (
		<div className='block w-full overflow-x-auto'>
			<h1 className='text-xl text-center uppercase p-2 border-b'>
				danh sách năm học
			</h1>
			<SchoolYearsList />
		</div>
	);
}
