'use client';
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DayOfTheWeek from '@/app/(admin)/_components/dayOfTheWeek';
import { Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { CheckCircle, Plus, Trash } from 'lucide-react';
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
import useRollCallsFormFields from './useRollCallsFormFields';
import WeekSelect from '@/app/(admin)/_components/week-select';
import LopHocSelect from '@/app/(admin)/_components/lopHoc-select';
import { useAppContext } from '@/app/app-provider';
import StudentByClassSelect from '@/app/(admin)/_components/student-select';
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
	const [selectedStudent, setSelectedStudent] = useState<number[]>([]);

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

			const { data } = response.payload;
			const results = Array.isArray(data) ? data : [];

			setStudents(results);
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

	return (
		<div className='flex flex-col'>
			<h1 className='text-lg uppercase text-center p-2 border-b my-2'>
				Điểm danh học sinh
			</h1>
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

			<h2 className='flex gap-2 mt-8'>
				<CheckCircle /> Danh sách học sinh
			</h2>
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
						</TableRow>
					</TableHeader>
					<TableBody>
						{students.map((item, index) => (
							<TableRow key={item.studentId}>
								<TableCell>
									<Input
										type='checkbox'
										className='w-4 h-4 ms-2'
										onChange={() => handleCheckboxChange(item.studentId)}
										checked={selectedStudent.includes(item.studentId)}
									/>
								</TableCell>
								<TableCell>{index + 1}</TableCell>
								<TableCell>{item.studentId}</TableCell>
								<TableCell>{item.fullname}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			) : (
				<>...</>
			)}

			{/*  */}
			<div className='flex items-center justify-end my-2'>
				<Button
					type='button'
					variant={'default'}
					onClick={addNewRollCallDetail}
					className='bg-blue-700 text-white'
				>
					<Plus /> Học sinh vắng
				</Button>
			</div>
			{fields.map((field, index) => (
				<div key={field.id} className='border p-4 rounded-xl mb-4 w-full'>
					{/* 1-col on mobile, 3-cols on md+ */}
					<div className='grid grid-cols-1 md:grid-cols-3 gap-4 w-full'>
						{/* Student select */}
						<div>
							<Label>Tên học sinh vắng</Label>
							<Controller
								{...register(`absences.${index}.studentId`)}
								render={({ field }) => (
									<StudentByClassSelect
										selectedSchoolId={Number(schoolId)}
										selectedClassId={watch('rollCall.classId')}
										selectedStudentId={field.value}
										onSelectStudent={field.onChange}
									/>
								)}
							/>
						</div>

						{/* Excused select */}
						<div>
							<Label>Có phép</Label>
							<Select
								onValueChange={(value) =>
									setValue(`absences.${index}.isExcused`, value === 'true')
								}
								defaultValue={
									watch(`absences.${index}.isExcused`) ? 'true' : 'false'
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
						</div>

						{/* Description input */}
						<div>
							<Label>Ghi chú</Label>
							<Textarea
								className='resize-none'
								rows={4}
								{...register(`absences.${index}.description`)}
								placeholder='Ghi chú...'
							/>
						</div>
					</div>

					{/* Trash button aligned right */}
					<div className='flex justify-end mt-3'>
						<Button
							variant='destructive'
							type='button'
							onClick={removeRollCallDetail(index)}
						>
							<Trash />
						</Button>
					</div>
				</div>
			))}
		</div>
	);
};

export default RollCallsFormField;
