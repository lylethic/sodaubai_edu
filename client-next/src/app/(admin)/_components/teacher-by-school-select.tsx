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
import { useFormContext } from 'react-hook-form';
import { TeacherResType } from '@/schemaValidations/teacher.schema';
import teacherApiRequest from '@/apiRequests/teacher';

interface TeacherSelectProps {
	selectedTeacherId: number | null;
	selectedSchoolId: number | null;
	onSelectTeacher: (teacherId: number) => void;
}

const TeachersBySchoolSelect = ({
	selectedTeacherId,
	selectedSchoolId,
	onSelectTeacher,
}: TeacherSelectProps) => {
	const [teachers, setTeachers] = useState<TeacherResType['data'][]>([]);

	const { setValue } = useFormContext();

	useEffect(() => {
		const getTeacherList = async () => {
			try {
				const response = await teacherApiRequest.teachersBySchoolNoLimit(
					selectedSchoolId
				);
				const result = Array.isArray(response.payload.data)
					? response.payload.data
					: [];

				setTeachers(result);
			} catch (error) {
				handleErrorApi({ error });
			}
		};
		if (selectedSchoolId) getTeacherList();
		else setTeachers([]);
	}, [selectedSchoolId]);

	return (
		<Popover modal={true}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					className={cn(
						'w-full justify-between',
						!selectedTeacherId && 'text-muted-foreground'
					)}
				>
					{selectedTeacherId
						? teachers.find((key) => key.teacherId === selectedTeacherId)
								?.fullname || selectedTeacherId
						: 'Chọn giáo viên...'}
					<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-full p-0'>
				<Command>
					<CommandInput placeholder='Nhập MÃ giáo viên để tìm kiếm...' />
					<CommandList>
						{teachers.length === 0 ? (
							<CommandEmpty>Không tìm thấy.</CommandEmpty>
						) : (
							<CommandGroup>
								{teachers.map((key) => (
									<CommandItem
										value={String(key.teacherId)}
										key={key.teacherId}
										onSelect={() => {
											onSelectTeacher(key.teacherId);
											setValue('teacherId', key.teacherId);
										}}
									>
										<Check
											className={cn(
												'mr-2 h-4 w-4',
												key.teacherId === selectedTeacherId
													? 'opacity-100'
													: 'opacity-0'
											)}
										/>
										{key.fullname}
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

export default TeachersBySchoolSelect;
