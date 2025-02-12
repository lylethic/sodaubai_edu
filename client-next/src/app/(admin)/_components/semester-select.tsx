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
import { semesterApiRequest } from '@/apiRequests/semester';
import { SemesterResType } from '@/schemaValidations/semester.schema';
import { QueryType } from '@/types/queryType';

interface Props {
	selected: number | null;
	onSelectedSemester: (semesterId: number) => void;
}

export default function SemesterSelect({
	selected,
	onSelectedSemester,
}: Props) {
	const [semesters, setSemesters] = useState<SemesterResType['data'][]>([]);
	const { setValue } = useFormContext();

	useEffect(() => {
		const fetchHocKys = async (queryObject: QueryType) => {
			try {
				const response = await semesterApiRequest.semesters(queryObject);
				const data = response.payload.data;
				const result = Array.isArray(data) ? data : [data];

				setSemesters(result);
				if (result.length > 0 && result[0].status === true && !selected) {
					onSelectedSemester(result[0].semesterId);
					setValue('semesterId', result[0].semesterId);
				}
			} catch (error: any) {
				handleErrorApi({ error });
			}
		};
		fetchHocKys({ pageNumber: 1, pageSize: 20 });
	}, []);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' className='w-full justify-between'>
					{semesters.find((item) => item.semesterId === selected)
						?.semesterName || 'Chọn học kỳ...'}
					<ChevronsUpDown className='ml-2 h-4 w-4 opacity-50' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-full max-h-60 overflow-y-auto'>
				{semesters.map((key) => (
					<DropdownMenuItem
						key={key.semesterId}
						onClick={() => {
							onSelectedSemester(key.semesterId);
							setValue('semesterId', key.semesterId);
						}}
					>
						<Check
							className={cn(
								'mr-2 h-4 w-4',
								key.semesterId === selected ? 'opacity-100' : 'opacity-0'
							)}
						/>
						<div className='w-full flex items-center justify-between'>
							{key.semesterName}
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
