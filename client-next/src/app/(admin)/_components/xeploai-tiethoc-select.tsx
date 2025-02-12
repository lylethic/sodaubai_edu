import { xepLoaiApiRequest } from '@/apiRequests/xeploaiTiethoc';
import { ClassifyResType } from '@/schemaValidations/xepLoaiTietHoc.schema';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Ban, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
	selected: number | null;
	onSelectedClassify: (classificationId: number) => void;
}

export default function XepLoaiTietHocSelect({
	selected,
	onSelectedClassify,
}: Props) {
	const [classifications, setClassifications] = useState<
		ClassifyResType['data'][]
	>([]);

	const { setValue } = useFormContext();
	useEffect(() => {
		const fetchXepLoai = async () => {
			try {
				const response = await xepLoaiApiRequest.xeploaisNoPagination();
				const data = response.payload.data;
				const result = Array.isArray(data) ? data : [data];
				setClassifications(result);
			} catch (error) {}
		};

		fetchXepLoai();
	}, []);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' className='w-full justify-between'>
					{classifications.find((item) => item.classificationId === selected)
						?.classifyName || 'Chọn xếp loại tiết học...'}
					<ChevronsUpDown className='ml-2 h-4 w-4 opacity-50' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-full max-h-60 overflow-y-auto'>
				{classifications.map((key) => (
					<DropdownMenuItem
						key={key.classificationId}
						onClick={() => {
							onSelectedClassify(key.classificationId);
							setValue('classificationId', key.classificationId);
						}}
					>
						<Check
							className={cn(
								'mr-2 h-4 w-4',
								key.classificationId === selected ? 'opacity-100' : 'opacity-0'
							)}
						/>
						<div className='w-full flex items-center justify-between'>
							{key.classifyName}
						</div>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
