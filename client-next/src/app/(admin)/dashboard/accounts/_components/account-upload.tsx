'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { handleErrorApi } from '@/lib/utils';
import accountApiRequest from '@/apiRequests/account';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Import } from 'lucide-react';

export default function AccountUploadButton() {
	const { toast } = useToast();
	const [file, setFile] = useState<File | null>(null);
	const router = useRouter();

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		const file = event.target.files?.[0];
		setFile(file || null);
	};

	const handleSubmit = async () => {
		if (!file) {
			toast({ description: 'Không có file nào được chọn' });
			return;
		}

		try {
			const formData = new FormData();
			formData.append('file', file as Blob);
			const response = await accountApiRequest.importExcel(formData);
			if (response.status === 200) {
				toast({ description: response.payload.message });
			} else {
				toast({ description: 'Có lỗi!' });
			}

			router.refresh();
		} catch (error: any) {
			handleErrorApi({ error });
		}
	};

	return (
		<div className='p-4 border rounded-xl'>
			<h1 className='font-medium my-4 uppercase'>
				Chọn file excel để nhập danh sách tài khoản
			</h1>
			<Input type='file' onChange={handleFileChange} />
			<Button
				type='button'
				variant={'default'}
				className='bg-blue-700 text-white mt-2'
				onClick={handleSubmit}
				disabled={!file}
			>
				<Import />
				Nhập danh sách tài khoản
			</Button>
		</div>
	);
}
