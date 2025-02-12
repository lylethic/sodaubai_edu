import React, { ChangeEvent, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { handleErrorApi } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Import } from 'lucide-react';
import { xepLoaiApiRequest } from '@/apiRequests/xeploaiTiethoc';

export default function ClassifyUploadButton({
	onSuccess,
}: {
	onSuccess: () => void;
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
			const response = await xepLoaiApiRequest.upload(formData);
			toast({ title: 'Thông báo', description: response.payload.message });
			if (onSuccess) onSuccess();
		} catch (error: any) {
			handleErrorApi({ error });
		}
	};

	return (
		<div className='p-4 border rounded-xl'>
			<h1 className='text-sm font-medium my-4 uppercase'>
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
				disabled={!file}
			>
				<Import />
				Nhập danh sách xếp loại tiết học
			</Button>
		</div>
	);
}
