import React from 'react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function SubjectDeleteDialog({
	isDialogOpen,
	setIsDialogOpen,
	onConfirmDelete: confirmDelete,
}: {
	isDialogOpen: boolean;
	setIsDialogOpen: (isOpen: boolean) => void;
	onConfirmDelete: () => void;
}) {
	return (
		<AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Xóa môn học</AlertDialogTitle>
					<AlertDialogDescription>
						Bạn có chắc chắn muốn xóa môn học này? Hành động này không thể hoàn
						tác.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
						Hủy
					</AlertDialogCancel>
					<AlertDialogAction className='bg-red-500' onClick={confirmDelete}>
						Xóa
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
