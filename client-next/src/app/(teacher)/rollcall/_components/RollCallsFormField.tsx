import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DayOfTheWeek from '@/app/(admin)/_components/dayOfTheWeek';
import { Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import useRollCallsFormFields from './useRollCallsFormFields';
import WeekSelect from '@/app/(admin)/_components/week-select';
import LopHocSelect from '@/app/(admin)/_components/lopHoc-select';
import { useAppContext } from '@/app/app-provider';
import TeachersBySchoolSelect from '@/app/(admin)/_components/teacher-by-school-select';
import StudentByClassSelect from '@/app/(admin)/_components/student-select';

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
	return (
		<>
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
							onSelectedLopHoc={(classId) => field.onChange(classId)}
						/>
					)}
				/>
				{/* <Input {...register('classId')} placeholder='Lớp học...' /> */}
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
				<div
					key={field.id}
					className='flex items-center justify-evenly border p-2 rounded-xl mb-2'
				>
					<div>
						<div>
							<Label>Học sinh vắng</Label>
							{/* <Input
								{...register(`absences.${index}.studentId`)}
								placeholder='Mã học sinh vắng...'
							/> */}
							<Controller
								{...register(`absences.${index}.studentId`)}
								render={({ field }) => (
									<StudentByClassSelect
										selectedSchoolId={Number(schoolId)}
										selectedClassId={watch('rollCall.classId')}
										selectedStudentId={field.value}
										onSelectStudent={(studentId) => field.onChange(studentId)}
									/>
								)}
							/>
						</div>
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
						<div>
							<Label>Ghi chú</Label>
							<Input
								{...register(`absences.${index}.description`)}
								placeholder='Ghi chú...'
							/>
						</div>
					</div>
					<Button
						variant={'destructive'}
						type='button'
						onClick={removeRollCallDetail(index)}
					>
						<Trash />
					</Button>
				</div>
			))}
		</>
	);
};

export default RollCallsFormField;
