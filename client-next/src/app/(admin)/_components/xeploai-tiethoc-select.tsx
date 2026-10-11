import { xepLoaiApiRequest } from '@/apiRequests/xeploaiTiethoc';
import { ClassificationResType } from '@/schemaValidations/xepLoaiTietHoc.schema';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type ClassifyType = ClassificationResType['data'];

interface Props {
	selected: number | null;
	onSelectedClassify: (classificationId: number) => void;
}

export default function XepLoaiTietHocSelect({
	selected,
	onSelectedClassify,
}: Props) {
	const [classifications, setClassifications] = useState<ClassifyType[]>([]);

	const { setValue } = useFormContext();
	useEffect(() => {
		const fetchXepLoai = async () => {
			try {
				const response = await xepLoaiApiRequest.xeploaisNoPagination();
				const data = (response.payload as any)?.data;
				const result =
					data?.items ?? (Array.isArray(data) ? data : []);
				setClassifications(result);
			} catch (error) {}
		};

		fetchXepLoai();
	}, []);

	const selectedItem = classifications.find(
		(item) => (item.classificationId || item.id) === selected
	);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' className='w-full justify-between'>
					{selectedItem?.classifyName ||
						selectedItem?.name ||
						'Chọn xếp loại tiết học...'}
					<ChevronsUpDown className='ml-2 h-4 w-4 opacity-50' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-full max-h-60 overflow-y-auto'>
				{classifications.map((key) => {
					const id = key.classificationId || key.id || 0;
					const name = key.classifyName || key.name || '';
					return (
						<DropdownMenuItem
							key={id}
							onClick={() => {
								onSelectedClassify(id);
								setValue('classificationId', id);
							}}
						>
							<Check
								className={cn(
									'mr-2 h-4 w-4',
									id === selected ? 'opacity-100' : 'opacity-0'
								)}
							/>
							<div className='w-full flex items-center justify-between'>
								{name}
							</div>
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
