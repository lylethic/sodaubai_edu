import React, { ChangeEvent, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { handleErrorApi } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PhanCongChuNhiemApiRequest } from '@/apiRequests/phanCongChuNhiem';
import { Import } from 'lucide-react';

export default function AssignTeachersUploadButton({
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
		if (!file) {
			toast({ description: 'Không có file nào được chọn' });
			return;
		}

		try {
			const formData = new FormData();
			formData.append('file', file as Blob);
			const response = await PhanCongChuNhiemApiRequest.upload(formData);
			if (response.status === 200) {
				toast({ description: response.payload.message });
			} else {
				toast({ description: 'Có lỗi!' });
			}
			setFile(null);
			if (onSuccess) onSuccess();
		} catch (error: any) {
			handleErrorApi({ error });
		}
	};

	return (
		<div className='p-4 border rounded-xl'>
			<h1 className='text-sm font-medium my-2 uppercase'>
				Chọn file excel để tải lên danh sách
			</h1>
			<Input
				aria-label='Import file'
				title='Import file'
				type='file'
				onChange={handleFileChange}
			/>
			<Button
				disabled={!file}
				type='button'
				variant={'default'}
				className='bg-blue-700 text-white my-2 uppercase'
				onClick={handleUpload}
			>
				<Import />
				nhập danh sách chủ nhiệm
			</Button>
		</div>
	);
}
