import React from 'react';
import SideBarItem from './_components/sidebar-item';
import SidebarItemResponsive from './_components/sidebar-item-responsive';
import MenuProfileAdmin from '@/components/header/menu-profile-admin';

export default function AdminDashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className='lg:flex h-screen w-full lg:overflow-y-hidden overflow-y-auto'>
			<SidebarItemResponsive />
			<div className='flex-1'>
				<SideBarItem />
				<main className='h-full overflow-y-auto'>
					<div className='p-2 flex items-center justify-end border-b-2 border-dark-200'>
						<MenuProfileAdmin />
					</div>
					<div className='p-4 overflow-x-hidden'>{children}</div>
				</main>
			</div>
		</div>
	);
}
