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
import { lopHocApiRequest } from '@/apiRequests/lopHoc';
import { handleErrorApi } from '@/lib/utils';
import { Trash2Icon } from 'lucide-react';
import { gradeApiRequest } from '@/apiRequests/grade';

type Props = {
	selectedItems: number[];
	onDeleted: (ids: number[]) => void;
};

export default function GradeBulkDelete(props: Props) {
	const { toast } = useToast();
	const handleBulkDelete = async () => {
		try {
			if (props.selectedItems.length === 0) {
				toast({ description: 'Không có mục nào được chọn' });
				return;
			}

			const response = await gradeApiRequest.bulkdelete(props.selectedItems);
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
					<AlertDialogTitle>Bạn có muốn xóa các khối lớp này?</AlertDialogTitle>
					<AlertDialogDescription>
						Các khối lớp đã chọn sẽ bị xóa vĩnh viễn.
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
