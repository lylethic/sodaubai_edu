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
import { SubjectResType } from '@/schemaValidations/subject.schema';
import { subjectApiRequest } from '@/apiRequests/subject';

interface Props {
	selected: number | null;
	onSelectedSubject: (subjectId: number) => void;
}

export default function SubjectSelect({ selected, onSelectedSubject }: Props) {
	const [subjects, setSubjects] = useState<
		SubjectResType['data'][]
	>([]);

	const { setValue } = useFormContext();
	useEffect(() => {
		const fetchSubjects = async () => {
			try {
				const response = await subjectApiRequest.subjects({
					pageNumber: 1,
					pageSize: 60,
				});
				const payload = response.payload as any;
				const items =
					payload?.data?.items ||
					(Array.isArray(payload?.data) ? payload.data : []);
				setSubjects(items);
			} catch (error) {}
		};

		fetchSubjects();
	}, []);

	const selectedItem = subjects.find(
		(item) => (item.subjectId || item.id) === selected
	);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' className='w-full justify-between'>
					{selectedItem?.subjectName ||
						selectedItem?.name ||
						'Chọn môn học...'}
					<ChevronsUpDown className='ml-2 h-4 w-4 opacity-50' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-full max-h-60 overflow-y-auto'>
				{subjects.map((key) => {
					const id = key.subjectId || key.id || 0;
					const name = key.subjectName || key.name || '';
					return (
						<DropdownMenuItem
							key={id}
							onClick={() => {
								onSelectedSubject(id);
								setValue('subjectId', id);
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
