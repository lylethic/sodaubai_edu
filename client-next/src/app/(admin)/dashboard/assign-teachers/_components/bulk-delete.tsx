import React from 'react';
import { useToast } from '@/hooks/use-toast';
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
import { handleErrorApi } from '@/lib/utils';
import { phanCongChuNhiemApiRequest } from '@/apiRequests/phanCongChuNhiem';
import { Trash2Icon } from 'lucide-react';

type Props = {
	selectedItems: number[];
	onDeleted: (ids: number[]) => void;
};

export default function BulkDeleteAssignTeachersButton(props: Props) {
	const { toast } = useToast();
	const handleBulkDelete = async () => {
		try {
			if (props.selectedItems.length === 0) {
				toast({ description: 'Không có mục nào được chọn' });
				return;
			}

			const response = await phanCongChuNhiemApiRequest.bulkdelete(
				props.selectedItems
			);
			toast({ description: response.payload.message });
			props.onDeleted(props.selectedItems);
		} catch (error) {
			handleErrorApi({ error });
		}
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					title='Xóa'
					className='bg-red-500 text-white p-2 rounded my-2'
					disabled={props.selectedItems.length === 0}
				>
					<Trash2Icon />
					Chọn nhiều mục để xóa
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Bạn có muốn xóa các phân công chủ nhiệm này?
					</AlertDialogTitle>
					<AlertDialogDescription>
						Các phân công chủ nhiệm đã chọn sẽ bị xóa vĩnh viễn.
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
