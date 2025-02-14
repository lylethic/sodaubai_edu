import React from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import ButtonLogout from '../button-logout';
import Link from 'next/link';

export default function MenuProfileAdmin() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild className='cursor-pointer'>
				<Image
					src={'/images/programmer.png'}
					alt='avatar'
					className='h-8 w-8 rounded-[50%]'
					width={40}
					height={40}
					priority
				/>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56' align='start'>
				<DropdownMenuLabel>Hồ sơ</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<Link
							href={'#'}
							className='flex justify-between items-center w-full h-full'
						>
							Cá nhân
							<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<ButtonLogout />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
