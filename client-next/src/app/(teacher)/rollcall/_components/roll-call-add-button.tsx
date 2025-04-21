import React, { useState } from 'react';
import RollCallForm from './RollCallForm';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function RollCallAddButton({
	onSuccess,
}: {
	onSuccess?: () => void;
}) {
	return (
		<Link href={'/rollcall/add'} passHref>
			<Button
				variant={'default'}
				className='bg-green-600 text-white font-semibold my-4'
			>
				<PlusCircle />
				Thêm mới
			</Button>
		</Link>
	);
}
