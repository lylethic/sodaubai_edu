import biaSoDauBaiApiRequest from '@/apiRequests/biasodaubai';
import { useToast } from '@/hooks/use-toast';
import { type Row } from '@tanstack/react-table';
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
import { BiaSoDauBaiResType } from '@/schemaValidations/biaSoDauBai.schema';
import { Trash2Icon } from 'lucide-react';

interface Props extends React.ComponentPropsWithoutRef<typeof AlertDialog> {
	selected: number[];
	onSuccess?: () => void;
}

export default function BulkDeleteBiaSoDauBai({ selected, onSuccess }: Props) {
	const { toast } = useToast();

	const handleBulkDelete = async () => {
		try {
			if (selected.length === 0) {
				toast({
					title: 'Thông báo',
					description: 'Vui lòng chọn sổ đầu bài',
				});
				return;
			}

			const response = await biaSoDauBaiApiRequest.bulkdelete(selected);
			toast({
				title: 'Thông báo',
				description: response.payload.message,
			});
			onSuccess?.();
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
					<AlertDialogTitle>
						Bạn có muốn xóa các sổ đầu bài này?
					</AlertDialogTitle>
					<AlertDialogDescription>
						Các sổ đầu bài đã chọn sẽ bị xóa vĩnh viễn.
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
