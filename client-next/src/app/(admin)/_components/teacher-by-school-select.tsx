import { useState, useEffect, useRef } from 'react';
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
import { QueryType } from '@/types/queryType';

interface TeacherSelectProps {
	selectedTeacherId: number;
	selectedSchoolId: number;
	onSelectTeacher: (teacherId: number) => void;
}

const TeachersBySchoolSelect = ({
	selectedTeacherId,
	selectedSchoolId,
	onSelectTeacher,
}: TeacherSelectProps) => {
	const [teachers, setTeachers] = useState<TeacherResType['data'][]>([]);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const latestPageRef = useRef(1);

	const { setValue } = useFormContext();

	const fetchTeacherList = async (page: QueryType, schoolId: number) => {
		if (loading || !hasMore || latestPageRef.current === page.pageSize) return;

		setLoading(true);
		latestPageRef.current === page.pageSize;
		try {
			const { payload } = await teacherApiRequest.teachersBySchoolNoLimit(
				page,
				schoolId
			);
			const result = Array.isArray(payload.data) ? payload.data : [];
			setTeachers((prev) => [...prev, ...result]);
			setHasMore(result.length > 0); // stop
		} catch (error) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setTeachers([]); // Reset
		setPage(1);
		setHasMore(true);
		latestPageRef.current = 1;
		fetchTeacherList({ pageNumber: page, pageSize: 20 }, selectedSchoolId);
	}, [selectedSchoolId]);

	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const bottom =
			e.currentTarget.scrollHeight - e.currentTarget.scrollTop <=
			e.currentTarget.clientHeight;
		if (bottom && hasMore && !loading) {
			const nextPage = page + 1;
			setPage(nextPage);
			fetchTeacherList(
				{ pageNumber: nextPage, pageSize: 20 },
				selectedSchoolId
			);
		}
	};
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
			<PopoverContent className='w-full p-0' onScroll={handleScroll}>
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
