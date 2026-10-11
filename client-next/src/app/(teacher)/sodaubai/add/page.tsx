'use client';

import { useRouter } from 'next/navigation';
import BiaSoDauBaiAddForm from '../_components/biasodaubai-add-form';

export default function SoDauBaiAddPage() {
	const router = useRouter();

	return (
		<div>
			<h1 className='text-lg uppercase'>Tạo mới sổ đầu bài</h1>
			<BiaSoDauBaiAddForm
				isOpen={true}
				onOpenChange={(open) => {
					if (!open) {
						router.back();
					}
				}}
			/>
		</div>
	);
}

