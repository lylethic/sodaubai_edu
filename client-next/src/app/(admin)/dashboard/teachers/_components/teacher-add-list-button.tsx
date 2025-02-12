'use client';

import React, { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { handleErrorApi } from '@/lib/utils';
import teacherApiRequest from '@/apiRequests/teacher';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TeacherUploadButton() {
	const { toast } = useToast();
	const [file, setFile] = useState<File | null>(null);
	const router = useRouter();

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		const file = event.target.files?.[0];
		setFile(file || null);
	};

	const handleUpload = async () => {
		if (!file) {
			toast({ description: 'Không có file nào được chọn' });
			return;
		}

		try {
			const formData = new FormData();
			formData.append('file', file as Blob);
			const response = await teacherApiRequest.importExcel(formData);
			if (response.status === 200) {
				toast({ description: response.payload.message });
			} else {
				toast({ description: 'Co loi!' });
			}

			router.refresh();
		} catch (error: any) {
			handleErrorApi({ error });
		}
	};

	return (
		<div className='p-4 border rounded-xl'>
			<h1 className='text-sm font-medium my-2 uppercase'>
				Chọn file excel để nhập danh sách giáo viên
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
				Nhập danh sách giáo viên
			</Button>
		</div>
	);
}
