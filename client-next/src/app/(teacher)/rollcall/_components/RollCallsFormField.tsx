'use client';
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DayOfTheWeek from '@/app/(admin)/_components/dayOfTheWeek';
import { Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Plus, PlusCircle, Trash } from 'lucide-react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import useRollCallsFormFields from './useRollCallsFormFields';
import WeekSelect from '@/app/(admin)/_components/week-select';
import LopHocSelect from '@/app/(admin)/_components/lopHoc-select';
import { useAppContext } from '@/app/app-provider';
import StudentByClassSelect from '@/app/(admin)/_components/student-select';
import StudentList from '../../students/_components/student-list';
import { StudentListResType } from '@/schemaValidations/student.schema';
import { studentApiRequest } from '@/apiRequests/student';
import { handleErrorApi } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

const RollCallsFormField = () => {
	const { user } = useAppContext();
	const {
		fields,
		register,
		setValue,
		watch,
		addNewRollCallDetail,
		removeRollCallDetail,
	} = useRollCallsFormFields();
	const schoolId = user?.schoolId;
	const [selectedClassId, setSelectedClassId] = useState<number>(0);
	const [loading, setLoading] = useState(false);
	const [students, setStudents] = useState<StudentListResType['data']>([]);
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [totalPageCount, setTotalPageCount] = useState<number>(0);
	const [selectedStudent, setSelectedStudent] = useState<number[]>([]);
	const [isOpen, setIsOpen] = useState(false);

	const handleCheckboxChange = (id: number) => {
		const updated = selectedStudent.includes(id)
			? selectedStudent.filter((key) => key !== id)
			: [...selectedStudent, id];

		setSelectedStudent(updated);
	};

	const handleSelectAll = () => {
		const updated =
			selectedStudent.length === students.length
				? []
				: students.map((s) => s.studentId);
		setSelectedStudent(updated);
	};

	const fetchData = async (schoolId: number, classId: number) => {
		if (loading) return;
		setLoading(true);

		try {
			const response = await studentApiRequest.studentsByClass(
				Number(schoolId),
				Number(classId)
			);

			const { data, pagination } = response.payload;
			const results = Array.isArray(data) ? data : [];
			const totalResults = pagination.totalResults;

			setStudents(results);
			setTotalPageCount(totalResults ? Math.ceil(totalResults) : 0);
		} catch (error: any) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	// Update classId whenever the LopHocSelect changes
	const handleClassChange = (classId: number) => {
		setSelectedClassId(classId); // update the local state for classId
		setValue('rollCall.classId', classId); // update the form state for classId
	};

	useEffect(() => {
		if (schoolId && selectedClassId) {
			fetchData(schoolId, selectedClassId);
		}
	}, [schoolId, selectedClassId]);

	console.log('Selected students:', selectedStudent); // Debug
	console.log(selectedClassId);

	return (
		<div className='flex flex-col w-full'>
			<div>
				<Label>Tuần học</Label>
				<Controller
					name='rollCall.weekId'
					render={({ field }) => (
						<WeekSelect
							selectedWeekId={field.value}
							onSelectWeek={(key) => field.onChange(key)}
						/>
					)}
				/>
				{/* <Input {...register('weekId')} placeholder='Tuần học...' /> */}
			</div>
			<div>
				<Label>Lớp học</Label>
				<Controller
					name='rollCall.classId'
					render={({ field }) => (
						<LopHocSelect
							selectedSchoolId={Number(schoolId)}
							selectedClassId={field.value}
							onSelectedLopHoc={(classId) => {
								field.onChange(classId);
								handleClassChange(classId);
							}}
						/>
					)}
				/>
			</div>
			<div>
				<Label>Thứ trong tuần</Label>
				<Controller
					name='rollCall.dayOfTheWeek'
					render={({ field }) => (
						<DayOfTheWeek value={field.value} onChange={field.onChange} />
					)}
				/>
			</div>
			<div>
				<Label>Ngày học</Label>
				<Input
					type='date'
					{...register('rollCall.dateAt')}
					placeholder='Ngày học...'
				/>
			</div>
			<div>
				<Label>Hiện diện</Label>
				<Input
					{...register('rollCall.numberOfAttendants')}
					placeholder='Hiện diện...'
				/>
			</div>

			{/* Open list students here to check attendance */}
			<Dialog
				open={isOpen}
				onOpenChange={(value) => setIsOpen(value)}
				modal={true}
			>
				<DialogTrigger asChild>
					<Button
						variant={'default'}
						className='bg-green-600 text-white font-semibold my-4'
					>
						<PlusCircle />
						Điểm danh
					</Button>
				</DialogTrigger>
				<DialogContent
					className='max-w-screen-xl max-h-[80vh] overflow-y-auto'
					aria-describedby='dialog-description'
				>
					<DialogHeader>
						<DialogTitle>Điểm danh</DialogTitle>
					</DialogHeader>
					{students.length > 0 ? (
						<Table className='w-full table-auto border-collapse min-w-[1000px] my-4 rounded-lg border'>
							<TableHeader className='border-b text-left text-gray-400'>
								<TableRow>
									<TableHead scope='col' className='ps-4 py-3'>
										<Checkbox
											onCheckedChange={handleSelectAll}
											checked={selectedStudent.length === students.length}
										/>
									</TableHead>
									<TableHead scope='col' className='px-2'>
										STT
									</TableHead>
									<TableHead scope='col' className='px-2'>
										Mã học sinh
									</TableHead>
									<TableHead scope='col' className='px-2'>
										Họ và tên
									</TableHead>
									<TableHead scope='col' className='px-2'>
										Có phép
									</TableHead>
									<TableHead scope='col' className='px-2'>
										Ghi chú
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{students.map((item, index) => (
									<TableRow key={item.studentId}>
										<TableCell>
											<Input
												{...register(`absences.${index}.description`)}
												type='checkbox'
												className='w-4 h-4 ms-2'
												onChange={() => handleCheckboxChange(item.studentId)}
												checked={selectedStudent.includes(item.studentId)}
											/>
										</TableCell>
										<TableCell>
											{index + 1 + (pageNumber - 1) * pageSize}
										</TableCell>
										<TableCell>{item.studentId}</TableCell>
										<TableCell>{item.fullname}</TableCell>
										<TableCell>
											<Select
												onValueChange={(value) =>
													setValue(
														`absences.${index}.isExcused`,
														value === 'true'
													)
												}
												defaultValue={
													watch(`absences.${index}.isExcused`)
														? 'true'
														: 'false'
												}
											>
												<SelectTrigger>
													<SelectValue placeholder='Chọn phép...' />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value='true'>Có</SelectItem>
													<SelectItem value='false'>Không</SelectItem>
												</SelectContent>
											</Select>
										</TableCell>
										<TableCell>
											<Textarea
												{...register(`absences.${index}.description`)}
												rows={3}
												placeholder='Ghi chú...'
											/>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					) : (
						<>!</>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default RollCallsFormField;
