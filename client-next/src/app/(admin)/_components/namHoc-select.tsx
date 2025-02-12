'use client';
import { useState, useEffect } from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Ban, Check, ChevronsUpDown } from 'lucide-react';
import { cn, handleErrorApi } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';
import { AcademicYearResType } from '@/schemaValidations/academicYear.schema';
import { namHocApiRequest } from '@/apiRequests/namHoc';

interface Props {
	selectedNamHoc: number | null;
	onSelectedNamHoc: (namHocId: number) => void;
}

export default function NamHocSelect({
	selectedNamHoc,
	onSelectedNamHoc,
}: Props) {
	const [namHocs, setNamHocs] = useState<AcademicYearResType['data'][]>([]);
	const { setValue } = useFormContext();

	useEffect(() => {
		const fetchNamHocs = async () => {
			try {
				const response = await namHocApiRequest.listNamHocs();
				const data = response.payload.data;
				const result = Array.isArray(data) ? data : [data];
				setNamHocs(result);
				if (result.length > 0 && result[0].status === true && !selectedNamHoc) {
					const firstItem = result[0];
					onSelectedNamHoc(firstItem.academicYearId);
					setValue('academicYearId', firstItem.academicYearId);
				}
			} catch (error: any) {
				handleErrorApi({ error });
			}
		};
		fetchNamHocs();
	}, []);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' className='w-full justify-between'>
					{namHocs.find((item) => item.academicYearId === selectedNamHoc)
						?.displayAcademicYearName || 'Chọn năm học...'}
					<ChevronsUpDown className='ml-2 h-4 w-4 opacity-50' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-full max-h-60 overflow-y-auto'>
				{namHocs.map((key) => (
					<DropdownMenuItem
						key={key.academicYearId}
						onClick={() => {
							onSelectedNamHoc(key.academicYearId);
							setValue('academicYearId', key.academicYearId);
						}}
					>
						<Check
							className={cn(
								'mr-2 h-4 w-4',
								key.academicYearId === selectedNamHoc
									? 'opacity-100'
									: 'opacity-0'
							)}
						/>
						<div className='w-full flex items-center justify-between'>
							{key.displayAcademicYearName}
							<Ban
								color='red'
								className={cn(
									'ml-2 h-4 w-4',
									key.status === false ? 'opacity-100' : 'opacity-0'
								)}
							/>
						</div>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
