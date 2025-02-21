'use client';
import React, { useEffect, useState } from 'react';
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
import Profile from '@/app/(teacher)/me/page';
import { TeacherResType } from '@/schemaValidations/teacher.schema';
import { useAppContext } from '@/app/app-provider';
import teacherApiRequest from '@/apiRequests/teacher';
import { handleErrorApi } from '@/lib/utils';

export default function MenuProfile() {
	const [information, setInformation] = useState<TeacherResType['data']>();
	const [loading, setLoading] = useState(false);

	const { user } = useAppContext();
	const accountId = Number(user?.accountId);
	useEffect(() => {
		const fetchInformation = async () => {
			setLoading(true);
			try {
				const { payload } = await teacherApiRequest.teacherByAccountId(
					accountId
				);
				setInformation(payload.data);
			} catch (error) {
				handleErrorApi({ error });
			} finally {
				setLoading(false);
			}
		};

		if (!loading && user) {
			fetchInformation();
		}
	}, [user]);
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild className='cursor-pointer'>
				{information && (
					<Image
						src={information.photoPath || '/images/programmer.png'}
						alt='avatar'
						className='h-8 w-8 rounded-[50%]'
						width={40}
						height={40}
						priority
					/>
				)}
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56' align='start'>
				<DropdownMenuLabel>Hồ sơ</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<Link
							href={'/me'}
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
