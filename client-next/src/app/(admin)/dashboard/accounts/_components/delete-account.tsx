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

export default function DeleteAccount({
	account,
	onDelete,
}: {
	account: AccountType;
	onDelete: (accountId: number) => void;
}) {
	const { toast } = useToast();

	const deleteAccount = async () => {
		try {
			const result = await accountApiRequest.deleteAccount(account.accountId);
			toast({ description: result.payload.message });

			onDelete(account.accountId);
		} catch (error: any) {
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
					<AlertDialogTitle>Bạn có muốn xóa tài khoản?</AlertDialogTitle>
					<AlertDialogDescription>
						Tài khoản &rdquo;{account.email}&rdquo; sẽ bị xóa vĩnh viễn.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Hủy</AlertDialogCancel>
					<AlertDialogAction onClick={deleteAccount}>Xóa</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
