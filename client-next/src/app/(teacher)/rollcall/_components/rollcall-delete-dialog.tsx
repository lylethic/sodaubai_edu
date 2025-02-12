'use client';

import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { AccountType } from '@/types/accountType';
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
import { rollcallApiRequest } from '@/apiRequests/rollcall';
import { RollCallResType } from '@/schemaValidations/rollcall-schema';

export default function RollCallDeleteDialog({
	data,
	onDelete,
}: {
	data: RollCallResType['data'];
	onDelete: (rollCallId: number) => void;
}) {
	const { toast } = useToast();

	const confirmDelete = async () => {
		try {
			const { payload } = await rollcallApiRequest.delete(data.rollCallId);
			toast({
				description: payload.message,
			});
			onDelete(data.rollCallId);
		} catch (error) {
			handleErrorApi({ error });
		}
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button title='Xóa' className='bg-red-500 text-white p-2 rounded'>
					Xóa
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Bạn có muốn xóa điểm danh này?</AlertDialogTitle>
					<AlertDialogDescription>
						Điểm danh mã &rdquo;{data.rollCallId}&rdquo; sẽ bị xóa vĩnh viễn.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Hủy</AlertDialogCancel>
					<AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
