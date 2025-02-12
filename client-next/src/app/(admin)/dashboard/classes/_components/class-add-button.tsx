import React, { useState } from 'react';
import ClassAddForm from './class-add-form';
import ClassUploadButton from './class-add-list-button';

export default function ClassAddButton({
	onSuccess,
}: {
	onSuccess: () => void;
}) {
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

	return (
		<div>
			<ClassAddForm
				isOpen={isDialogOpen}
				onOpenChange={(value) => setIsDialogOpen(value)}
				onSuccess={onSuccess}
			/>
			<ClassUploadButton />
		</div>
	);
}
