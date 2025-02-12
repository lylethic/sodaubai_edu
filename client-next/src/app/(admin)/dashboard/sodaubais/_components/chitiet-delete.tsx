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
import { ChiTietSoDauBaiResType } from '@/schemaValidations/chiTietSoDauBai.schema';
import chiTietSoDauBaiApiRequest from '@/apiRequests/chiTietSoDauBai';
import { Trash } from 'lucide-react';

export default function DeleteChiTietSoDauBai({
	chitiet,
	onDelete,
}: {
	chitiet: ChiTietSoDauBaiResType['data'];
	onDelete: (chiTietSoDauBaiId: number) => void;
}) {
	const { toast } = useToast();

	const handleDelete = async () => {
		try {
			const result = await chiTietSoDauBaiApiRequest.delete(
				chitiet.chiTietSoDauBaiId
			);
			toast({ description: result.payload.message });

			onDelete(chitiet.chiTietSoDauBaiId);
		} catch (error: any) {
			handleErrorApi({ error });
		}
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					title='Xóa'
					className='flex items-center justify-evenly bg-red-500 text-white p-2 rounded w-[80px]'
				>
					<Trash />
					Xóa
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Bạn có muốn xóa bản ghi này?</AlertDialogTitle>
					<AlertDialogDescription>
						Bản ghi này sẽ bị xóa vĩnh viễn.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Hủy</AlertDialogCancel>
					<AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
