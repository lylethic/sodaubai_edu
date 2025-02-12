import { useToast } from '@/hooks/use-toast';
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
import teacherApiRequest from '@/apiRequests/teacher';
import { Trash2Icon } from 'lucide-react';

export default function BulkDeleteTeacher({
	selected,
	onDeleteSuccess,
}: {
	selected: number[];
	onDeleteSuccess: () => void;
}) {
	const { toast } = useToast();
	const handleBulkDelete = async () => {
		try {
			if (selected.length === 0) {
				toast({
					title: 'Thông báo',
					description: 'Không có tài khoản nào được chọn',
				});
				return;
			}
			const result = await teacherApiRequest.bulkDelete(selected);
			toast({
				title: 'Thông báo',
				description: result.payload.message,
			});
			onDeleteSuccess();
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
						Bạn có muốn xóa các tài khoản này?
					</AlertDialogTitle>
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
