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
import { StudentResType } from '@/schemaValidations/student.schema';
import { studentApiRequest } from '@/apiRequests/student';

interface TeacherSelectProps {
	selectedStudentId: number;
	selectedSchoolId: number;
	selectedClassId: number;
	onSelectStudent: (studentId: number) => void;
}

const StudentByClassSelect = ({
	selectedStudentId,
	selectedSchoolId,
	selectedClassId,
	onSelectStudent,
}: TeacherSelectProps) => {
	const [students, setStudents] = useState<StudentResType['data'][]>([]);

	const { setValue } = useFormContext();

	useEffect(() => {
		const getTeacherList = async () => {
			try {
				const response = await studentApiRequest.studentsByClass(
					selectedSchoolId,
					selectedClassId
				);
				const result = Array.isArray(response.payload.data)
					? response.payload.data
					: [];

				setStudents(result);
			} catch (error) {
				handleErrorApi({ error });
			}
		};
		if (selectedSchoolId) getTeacherList();
		else setStudents([]);
	}, [selectedSchoolId, selectedClassId]);

	console.log(students);

	return (
		<Popover modal={true}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					className={cn(
						'w-full justify-between',
						!selectedStudentId && 'text-muted-foreground'
					)}
				>
					{selectedStudentId
						? students.find((key) => key.studentId === selectedStudentId)
								?.fullname || selectedStudentId
						: 'Chọn học sinh...'}
					<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-full p-0'>
				<Command>
					<CommandInput placeholder='Nhập MÃ học sinh để tìm kiếm...' />
					<CommandList>
						{students.length === 0 ? (
							<CommandEmpty>Không tìm thấy.</CommandEmpty>
						) : (
							<CommandGroup>
								{students.map((key) => (
									<CommandItem
										value={String(key.studentId)}
										key={key.studentId}
										onSelect={() => {
											onSelectStudent(key.studentId);
											setValue('studentId', key.studentId);
										}}
									>
										<Check
											className={cn(
												'mr-2 h-4 w-4',
												key.studentId === selectedStudentId
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

export default StudentByClassSelect;
