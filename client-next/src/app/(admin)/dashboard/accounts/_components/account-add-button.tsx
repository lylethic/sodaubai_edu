import React from 'react';
import { Button } from '@/components/ui/button';
import { isClient } from '@/lib/http';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export default function AccountAddButton() {
	// const accessToken = localStorage.getItem('accessToken');
	// const isAuthenticated = isClient() && Boolean(accessToken);

	// if (!isAuthenticated) return null;

	return (
		<div className='flex flex-col justify-center'>
			<Link href={'/dashboard/accounts/add'}>
				<Button
					type='button'
					variant={'default'}
					className='bg-green-700 text-white my-2 uppercase'
				>
					<PlusCircle />
					Thêm tài khoản
				</Button>
			</Link>
		</div>
	);
}
