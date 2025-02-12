'use client';
import React, { useEffect, useState } from 'react';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn, handleErrorApi } from '@/lib/utils';
import { LopHocResType } from '@/schemaValidations/lopHoc.shema';
import { useFormContext } from 'react-hook-form';
import { lopHocApiRequest } from '@/apiRequests/lopHoc';

interface Props {
	selectedSchoolId: number | null;
	selectedClassId?: number | null;
	onSelectedLopHoc: (schoolId: number) => void;
}

export default function LopHocSelect({
	selectedSchoolId,
	selectedClassId,
	onSelectedLopHoc,
}: Props) {
	const [lopHocs, setLopHocs] = useState<LopHocResType['data'][]>([]);
	const [filterText, setFilterText] = useState('');
	const { setValue } = useFormContext();

	useEffect(() => {
		const fetchLopHocs = async () => {
			try {
				const response = await lopHocApiRequest.getLopHocBySchoolNoLimit(
					selectedSchoolId
				);
				const data = response.payload.data;
				const result = Array.isArray(data) ? data : [];
				setLopHocs(result);
			} catch (error: any) {
				handleErrorApi({ error });
			}
		};

		if (selectedSchoolId) fetchLopHocs();
		else setLopHocs([]);
	}, [selectedSchoolId]);

	return (
		<Popover modal={true}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					className={cn(
						'w-full justify-between',
						!selectedClassId && 'text-muted-foreground'
					)}
				>
					{selectedClassId
						? lopHocs.find((key) => key.classId === selectedClassId)
								?.className || selectedClassId
						: 'Chọn lớp học...'}
					<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-full p-0'>
				<Command>
					<CommandInput placeholder='Nhập MÃ lớp học để tìm kiếm...' />
					<CommandList>
						{lopHocs.length === 0 ? (
							<CommandEmpty>Không tìm thấy.</CommandEmpty>
						) : (
							<CommandGroup>
								{lopHocs.map((key) => (
									<CommandItem
										key={key.classId}
										value={String(key.classId)}
										onSelect={() => {
											onSelectedLopHoc(key.classId);
											setValue('ClassId', key.classId);
										}}
									>
										<Check
											className={cn(
												'mr-2 h-4 w-4',
												key.classId === selectedClassId
													? 'opacity-100'
													: 'opacity-0'
											)}
										/>
										{key.className}
									</CommandItem>
								))}
							</CommandGroup>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
