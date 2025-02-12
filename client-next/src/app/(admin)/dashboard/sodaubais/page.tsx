import React from 'react';
import SoDauBaiListPage from './_components/bia-sodaubai-list';

export default function SoDauBaiPage() {
	return (
		<div>
			<h1 className='text-lg uppercase text-center p-2 border-b'>
				danh sách sổ đầu bài
			</h1>
			<SoDauBaiListPage />
		</div>
	);
}
