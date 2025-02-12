'use client';
import React, { useState } from 'react';
import ChiTietSodauBaiAddForm from './chitiet-add-form';
import { ChiTietAddResType } from '@/schemaValidations/chiTietSoDauBai.schema';

export default function ChiTietSoDauBaiAddButton({
	chiTietSoDauBai,
	onSuccess,
}: {
	chiTietSoDauBai?: ChiTietAddResType['data'];

	onSuccess?: () => void;
}) {
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
	return (
		<ChiTietSodauBaiAddForm
			chiTietSoDauBai={chiTietSoDauBai}
			isOpen={isDialogOpen}
			onSuccess={onSuccess}
			onOpenChange={(value) => setIsDialogOpen(value)}
		/>
	);
}
