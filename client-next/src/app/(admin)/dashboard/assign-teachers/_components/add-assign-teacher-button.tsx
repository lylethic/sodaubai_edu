import React, { useState } from 'react';
import AssignTeacherAddForm from './add-assign-teacher-form';
import AssignTeachersUploadButton from './assign-teacher-upload';

export default function AssignTeacherAddButton({
	onSuccess,
}: {
	onSuccess: () => void;
}) {
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

	return (
		<div>
			<AssignTeacherAddForm
				isOpen={isDialogOpen}
				onOpenChange={(value) => setIsDialogOpen(value)}
				onSuccess={onSuccess}
			/>
			<AssignTeachersUploadButton onSuccess={onSuccess} />
		</div>
	);
}
