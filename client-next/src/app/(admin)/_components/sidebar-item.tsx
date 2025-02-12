'use client';
import React from 'react';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { MenuIcon, MountainIcon } from '@/components/ui/icons/icons';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { sidebarNavItems } from '@/app/(admin)/_components/sidebar-data';
import { ModeToggle } from '@/components/mode-toggle';
import { usePathname } from 'next/navigation';

export default function SideBarItem() {
	const pathname = usePathname();

	return (
		<header className='sticky top-0 z-10 border-b bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900 lg:hidden'>
			<div className='flex items-center justify-between'>
				<Link
					href='#'
					className='flex items-center gap-2 font-bold outline-none'
					prefetch={false}
				>
					<MountainIcon className='h-6 w-6' />
					<span className='text-lg uppercase'>sổ đầu bài điện tử</span>
				</Link>
				<Sheet>
					<SheetTrigger asChild>
						<Button variant='outline' size='icon'>
							<MenuIcon className='h-6 w-6' />
							<span className='sr-only'>Toggle navigation</span>
						</Button>
					</SheetTrigger>
					<SheetContent side='left' className='w-64'>
						<div className='flex h-full flex-col justify-between py-6 px-4'>
							<div className='space-y-6'>
								<nav className='space-y-1'>
									{sidebarNavItems.map((item, index) => {
										const isActive =
											pathname === item.href ||
											pathname.startsWith(`${item.href}/`);

										return (
											<Link
												key={index}
												href={item.href}
												className={`${
													isActive
														? 'bg-blue-500 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-white'
														: 'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-400'
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
					</SheetContent>
				</Sheet>
			</div>
		</header>
	);
}
