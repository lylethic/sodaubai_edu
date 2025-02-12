import React from 'react';
import MeProfile from '../_components/user-infor';

export default function Profile() {
	return (
		<>
			<div className='overflow-x-auto border rounded-xl p-4'>
				<h1 className='text-center mt-4 text-lg uppercase font-bold'>
					hồ sơ giáo viên
				</h1>
				<MeProfile />
			</div>
		</>
	);
}
