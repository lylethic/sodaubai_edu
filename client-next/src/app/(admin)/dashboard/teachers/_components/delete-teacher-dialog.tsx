import teacherApiRequest from '@/apiRequests/teacher';
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
import { useToast } from '@/hooks/use-toast';
import { TeacherResType } from '@/schemaValidations/teacher.schema';

type TeacherType = TeacherResType['data'];

export async function DeleteTeacherDialog({
	teacher,
	onDelete,
}: {
	teacher: TeacherType;
	onDelete: (id: number) => void;
}) {
	const { toast } = useToast();

	const deleteTeacher = async () => {
		try {
			const response = await teacherApiRequest.delete(teacher.teacherId);
			toast({
				description: response.payload.message,
			});
			onDelete(teacher.teacherId);
		} catch (error) {}
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					title='Xóa'
					className='bg-red-500 text-white p-2 rounded'
					variant='outline'
				>
					Xóa
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Bạn có muốn xóa giáo viên này?</AlertDialogTitle>
					<AlertDialogDescription>
						Tài khoản &rdquo;{teacher.fullname}&rdquo; sẽ bị xóa vĩnh viễn.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Hủy</AlertDialogCancel>
					<AlertDialogAction onClick={deleteTeacher}>
						Xác nhận
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
