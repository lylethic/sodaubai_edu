import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import WeekSelect from '@/app/(admin)/_components/week-select';
import SchoolSelect from '@/app/(admin)/_components/school-select';
import { useAppContext } from '@/app/app-provider';
import GradeSelect from '@/app/(admin)/_components/grade-select';

interface FilterProps {
	weekId: number | null;
	schoolId: number | null;
	gradeId: number | null;
	onFilterChange?: (
		schoolId: number | null,
		weekId: number | null,
		gradeId: number | null
	) => void;
	onReset?: () => void;
}

export default function FilteWeek({
	schoolId,
	weekId,
	gradeId,
	onFilterChange,
	onReset,
}: FilterProps) {
	const form = useForm();
	const { user } = useAppContext();

	// admin 1 school
	const roleIdFromAppContext = Number(user?.roleId);

	// Initialize state with initial filters or default values
	const [filters, setFilters] = useState({
		schoolId: schoolId ?? null,
		weekId: weekId ?? null,
		gradeId: gradeId ?? null,
	});

	// Handle filter changes and propagate them via callback
	const handleFilterChange = (field: string, value: any) => {
		const updatedFilters = { ...filters, [field]: value };
		setFilters(updatedFilters);
		if (onFilterChange) {
			onFilterChange(
				updatedFilters.schoolId,
				updatedFilters.weekId,
				updatedFilters.gradeId
			);
		}
	};

	const handleReset = () => {
		setFilters({ schoolId: null, weekId: null, gradeId: null });
		if (onFilterChange) {
			onFilterChange(null, null, null);
		}
		if (onReset) onReset();
	};

	return (
		<div className='flex flex-col p-6 rounded-xl border my-2 w-full'>
			<span className='font-header'>Lọc dữ liệu</span>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(() => {})} className='space-y-8'>
					{roleIdFromAppContext === 7 && (
						<FormField
							control={form.control}
							name='schoolId'
							render={({ field }) => (
								<FormItem className='space-y-2'>
									<FormLabel>Trường học</FormLabel>
									<SchoolSelect
										selectedSchoolId={schoolId}
										onSelectSchool={(id) => handleFilterChange('schoolId', id)}
									/>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}
					<FormField
						control={form.control}
						name='weekId'
						render={({ field }) => (
							<FormItem className='space-y-2'>
								<FormLabel>Tuần học</FormLabel>
								<WeekSelect
									selectedWeekId={weekId}
									onSelectWeek={(weekId) =>
										handleFilterChange('weekId', weekId)
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
							<FormItem className='space-y-2'>
								<FormLabel>Khối lớp học</FormLabel>
								<GradeSelect
									selectedGradeId={gradeId}
									onSelectedGrade={(gradeId) =>
										handleFilterChange('gradeId', gradeId)
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
