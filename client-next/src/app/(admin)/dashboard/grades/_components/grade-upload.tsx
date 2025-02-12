'use client';

import React, { ChangeEvent, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { handleErrorApi } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { gradeApiRequest } from '@/apiRequests/grade';
import { Import } from 'lucide-react';

export default function GradeUploadButton({
	onRefresh,
}: {
	onRefresh: () => void;
}) {
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
			const response = await gradeApiRequest.upload(formData);
			toast({ title: 'Thông báo', description: response.payload.message });
			if (onRefresh) onRefresh();
		} catch (error: any) {
			handleErrorApi({ error });
		}
	};

	return (
		<div className='p-4 border rounded-xl'>
			<h1 className='text-sm font-medium my-2 uppercase'>
				Chọn file excel để nhập danh sách
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
				<Import /> Nhập danh sách khối lớp
			</Button>
		</div>
	);
}
