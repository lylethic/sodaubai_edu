import React from 'react';
import { NavbarMenu } from './NavbarMenu';

export default function Navbar() {
	return (
		<div className='flex aligns-center p-[10px] border'>
			<div className='flex justify-end w-full'>
				<NavbarMenu />
			</div>
		</div>
	);
}
