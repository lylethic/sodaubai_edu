'use client';

import React from 'react';
import { GlobeIcon, MenuIcon, MountainIcon } from '@/components/ui/icons/icons';
import Link from 'next/link';
import { sidebarNavItems } from '@/app/(admin)/_components/sidebar-data';
import { ModeToggle } from '@/components/mode-toggle';
import { usePathname } from 'next/navigation';

export default function SidebarItemResponsive() {
	const pathname = usePathname();

	return (
		<div className='hidden lg:block lg:w-64 lg:shrink-0 lg:border-r lg:bg-gray-100 dark:lg:bg-gray-800'>
			<div className='flex h-full flex-col justify-between py-6 px-4 overflow-y-auto'>
				<div className='space-y-6'>
					<Link
						href='#'
						className='flex items-center gap-2 font-bold outline-none'
						prefetch={false}
					>
						<MountainIcon className='h-6 w-6' />
						<div className='text-lg uppercase flex flex-col align-middle justify-center items-center'>
							<span>sổ đầu bài</span>
							<span>điện tử</span>
						</div>
					</Link>
					<nav className='space-y-1'>
						{sidebarNavItems.map((item, index) => {
							// Ensure active status only for exact match or proper sub-path.
							const isActive =
								pathname === item.href || pathname.startsWith(`${item.href}/`);

							// const isActive =
							// pathname === item.href || pathname.startsWith(`${item.href}/`);

							return (
								<Link
									key={index}
									href={item.href}
									className={`${
										isActive
											? 'bg-blue-500 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-white'
											: 'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-50'
									}`}
									prefetch={false}
								>
									{<item.icon />}
									<span className='uppercase'>{item.title}</span>
								</Link>
							);
						})}
					</nav>
				</div>
				<div className='space-y-4'>
					<div className='flex items-center justify-end gap-2 text-sm'>
						Theme <ModeToggle />
					</div>
				</div>
			</div>
		</div>
	);
}
