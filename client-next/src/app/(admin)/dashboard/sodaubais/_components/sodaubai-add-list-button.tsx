'use client';

import React, { ChangeEvent, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { handleErrorApi } from '@/lib/utils';
import biaSoDauBaiApiRequest from '@/apiRequests/biasodaubai';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SoDauBaiUpload() {
	const { toast } = useToast();
	const [file, setFile] = useState<File | null>(null);

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		const file = event.target.files?.[0];
		setFile(file || null);
	};

	const handleUpload = async () => {
		try {
			const formData = new FormData();
			formData.append('file', file as Blob);
			const response = await biaSoDauBaiApiRequest.importExcel(formData);
			toast({ title: 'Thông báo', description: response.payload.message });
		} catch (error: any) {
			handleErrorApi({ error });
		}
	};

	return (
		<div className='p-4 border rounded-xl'>
			<h1 className='text-sm font-medium my-2 uppercase'>
				Chọn file excel để nhập danh sách sổ đầu bài
			</h1>
			<Input
				aria-label='Import file'
				title='Import file'
				type='file'
				onChange={handleFileChange}
			/>
			<Button
				type='button'
				variant={'default'}
				className='bg-blue-700 text-white my-2 uppercase'
				onClick={handleUpload}
			>
				Nhập danh sách sổ đầu bài
			</Button>
		</div>
	);
}
