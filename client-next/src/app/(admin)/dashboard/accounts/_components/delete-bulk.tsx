'use client';
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import accountApiRequest from '@/apiRequests/account';
import { handleErrorApi } from '@/lib/utils';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2Icon } from 'lucide-react';

export default function BulkDeleteAccount({
	selected,
	onDeleted,
}: {
	selected: number[];
	onDeleted: (deleteIds: number[]) => void;
}) {
	const { toast } = useToast();

	const handleBulkDelete = async () => {
		try {
			if (selected.length === 0) {
				toast({ description: 'Không có tài khoản nào được chọn' });
				return;
			}

			const result = await accountApiRequest.bulkDeleteAccount(selected);

			toast({ description: result.payload.message });
			onDeleted(selected);
		} catch (error: any) {
			handleErrorApi({ error });
		}
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					title='Xóa'
					className='bg-red-500 text-white p-2 rounded my-2'
					disabled={selected.length === 0}
				>
					<Trash2Icon />
					Chọn nhiều mục để xóa
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Bạn có muốn xóa tài khoản?</AlertDialogTitle>
					<AlertDialogDescription>
						Các tài khoản đã chọn sẽ bị xóa vĩnh viễn.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Hủy</AlertDialogCancel>
					<AlertDialogAction onClick={handleBulkDelete}>Xóa</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
