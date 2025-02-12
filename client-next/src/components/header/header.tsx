'use client';

import { useAppContext } from '@/app/app-provider';
import { ModeToggle } from '../mode-toggle';
import HeaderSchool from './header_school/header-school';
import MenuProfile from './menu-profile';

export default function Header() {
	const { user } = useAppContext();

	return (
		<header className='flex flex-col md:flex-row justify-between align-middle max-w-full border-b py-2 px-6'>
			<HeaderSchool />
			<div className='flex-1 flex items-center justify-center'>
				<span className='uppercase font-bold text-center'>
					hệ thống quản lý sổ đầu bài điện tử
				</span>
			</div>
			{user ? (
				<div className='flex-1 flex items-center justify-end'>
					<MenuProfile />
					<ModeToggle />
				</div>
			) : (
				<div className='flex-1 flex items-center justify-end'>
					<ModeToggle />
				</div>
			)}
		</header>
	);
}
