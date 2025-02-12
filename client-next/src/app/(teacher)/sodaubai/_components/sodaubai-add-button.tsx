'use client';

import React, { useState } from 'react';
import BiaSoDauBaiAddForm from './biasodaubai-add-form';
import SoDauBaiUpload from './sodaubai-add-list-button';

export default function SodauBaiAddButton({
	onSuccess,
}: {
	onSuccess: () => void;
}) {
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

	return (
		<>
			<SoDauBaiUpload />
			<BiaSoDauBaiAddForm
				isOpen={isDialogOpen}
				onSuccess={onSuccess}
				onOpenChange={(value) => {
					setIsDialogOpen(value);
					if (!value) {
						setIsDialogOpen(false);
					}
				}}
			/>
		</>
	);
}
