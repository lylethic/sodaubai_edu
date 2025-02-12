import React from 'react';
import XepLoaiTietHocList from './_components/xep-loai-tiet-hoc-list';

export default function XepLoaiTietHocPage() {
	return (
		<div className='block w-full overflow-x-auto'>
			<h1 className='text-2xl text-center uppercase p-2 border-b'>
				Danh sách điểm xếp loại
			</h1>
			<XepLoaiTietHocList />
		</div>
	);
}
