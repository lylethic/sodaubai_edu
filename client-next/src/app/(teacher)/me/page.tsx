import React from 'react';
import MeProfile from '@/components/profile/me-profile';

export default function Profile() {
	return (
		<div className='container mx-auto py-6 px-4'>
			<h1 className='text-center mb-6 text-2xl uppercase font-bold tracking-wide'>
				Thông tin cá nhân
			</h1>
			<MeProfile />
		</div>
	);
}

