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

export default function RollCallAddButton({
	onSuccess,
}: {
	onSuccess?: () => void;
}) {
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} modal={true}>
			<DialogTrigger asChild>
				<Button
					variant={'default'}
					className='bg-green-600 text-white font-semibold my-4'
				>
					<PlusCircle />
					Thêm mới
				</Button>
			</DialogTrigger>
			<DialogContent
				className='max-w-xl max-h-[80vh] overflow-y-auto'
				aria-describedby={undefined}
			>
				<DialogHeader>
					<DialogTitle>Điểm danh</DialogTitle>
					<div className='border-b border-gray-200 mt-2 mb-4'></div>
				</DialogHeader>
				<RollCallForm />
			</DialogContent>
		</Dialog>
	);
}
