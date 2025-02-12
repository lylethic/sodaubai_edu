import { useState, useEffect } from 'react';
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
import schoolApiRequest from '@/apiRequests/school';
import { SchoolType } from '@/types/schoolType';
import { useFormContext } from 'react-hook-form';

interface SchoolSelectProps {
	selectedSchoolId: number | null;
	onSelectSchool: (schoolId: number) => void;
}

const SchoolSelect = ({
	selectedSchoolId,
	onSelectSchool,
}: SchoolSelectProps) => {
	const [schools, setSchools] = useState<SchoolType[]>([]);

	const { setValue } = useFormContext();

	useEffect(() => {
		const getSchoolList = async () => {
			try {
				const response = await schoolApiRequest.getSchoolsNoPagination();
				const result = Array.isArray(response.payload.data)
					? response.payload.data
					: [response.payload.data];
				setSchools(result);
				// if (result.length > 0 && !selectedSchoolId) {
				// 	onSelectSchool(result[0].schoolId);
				// 	setValue('schoolId', result[0].schoolId);
				// }
			} catch (error) {
				handleErrorApi({ error });
			}
		};
		getSchoolList();
	}, [selectedSchoolId]);

	return (
		<Popover modal={true}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					className={cn(
						'w-full justify-between',
						!selectedSchoolId && 'text-muted-foreground'
					)}
				>
					{selectedSchoolId
						? schools.find((school) => school.schoolId === selectedSchoolId)
								?.nameSchool
						: 'Chọn trường học...'}
					<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-full p-0'>
				<Command>
					<CommandInput placeholder='Nhập MÃ trường học để tìm kiếm...' />
					<CommandList>
						{schools.length === 0 ? (
							<CommandEmpty>Không tìm thấy.</CommandEmpty>
						) : (
							<CommandGroup>
								{schools.map((school) => (
									<CommandItem
										value={String(school.schoolId)}
										key={school.schoolId}
										onSelect={() => {
											onSelectSchool(school.schoolId);
											setValue('SchoolId', school.schoolId);
										}}
									>
										<Check
											className={cn(
												'mr-2 h-4 w-4',
												school.schoolId === selectedSchoolId
													? 'opacity-100'
													: 'opacity-0'
											)}
										/>
										{school.nameSchool}
									</CommandItem>
								))}
							</CommandGroup>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export default SchoolSelect;
