import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import SchoolSelect from '@/app/(admin)/_components/school-select';
import { Button } from '@/components/ui/button';
import GradeSelect from '@/app/(admin)/_components/grade-select';
import LopHocSelect from '@/app/(admin)/_components/lopHoc-select';

interface FilterProps {
	initialFilters?: {
		schoolId: number | null;
		gradeId: number | null;
		classId: number | null;
	};
	onFilterChange: (filters: {
		schoolId: number | null;
		gradeId: number | null;
		classId: number | null;
	}) => void;
	onReset?: () => void;
}

export default function FilterAssignTeachers({
	initialFilters,
	onFilterChange,
	onReset,
}: FilterProps) {
	const form = useForm();

	const [filters, setFilters] = useState({
		schoolId: initialFilters?.schoolId ?? null,
		gradeId: initialFilters?.gradeId ?? null,
		classId: initialFilters?.classId ?? null,
	});

	const handleFilterChange = (field: string, value: any) => {
		const updatedFilters = { ...filters, [field]: value };
		setFilters(updatedFilters);
		if (onFilterChange) {
			onFilterChange(updatedFilters);
		}
	};

	const handleReset = () => {
		setFilters({ schoolId: null, gradeId: null, classId: null });
		if (onFilterChange)
			onFilterChange({ schoolId: null, gradeId: null, classId: null });
		if (onReset) onReset();
	};

	return (
		<div className='w-full flex flex-col justify-center border rounded-xl p-4 my-2'>
			<div className='font-header'>Vui lòng chọn thông tin</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(() => {})}>
					<FormField
						control={form.control}
						name='schoolId'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Trường học</FormLabel>
								<SchoolSelect
									selectedSchoolId={filters.schoolId}
									onSelectSchool={(schoolId) =>
										handleFilterChange('schoolId', schoolId)
									}
								/>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='gradeId'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Khối lớp</FormLabel>
								<GradeSelect
									selectedGradeId={filters.gradeId}
									onSelectedGrade={(gradeId) =>
										handleFilterChange('gradeId', gradeId)
									}
								/>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='classId'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Lớp học</FormLabel>
								<LopHocSelect
									selectedClassId={filters.classId}
									selectedSchoolId={filters.schoolId}
									onSelectedLopHoc={(classId) =>
										handleFilterChange('classId', classId)
									}
								/>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						variant='default'
						type='button'
						className='mt-3'
						onClick={handleReset}
					>
						Hủy bỏ
					</Button>
				</form>
			</Form>
		</div>
	);
}
