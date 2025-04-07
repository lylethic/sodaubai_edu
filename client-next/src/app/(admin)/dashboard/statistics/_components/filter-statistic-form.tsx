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
import { useAppContext } from '@/app/app-provider';
import GradeSelect from '@/app/(admin)/_components/grade-select';

interface FilterProps {
	weekId: number | null;
	gradeId: number | null;
	onFilterChange?: (weekId: number | null, gradeId: number | null) => void;
	onReset?: () => void;
}

export default function TeacherFilterStatisticByWeekPage({
	weekId,
	gradeId,
	onFilterChange,
	onReset,
}: FilterProps) {
	const form = useForm();
	const { user } = useAppContext();
	// Initialize state with initial filters or default values
	const [filters, setFilters] = useState({
		weekId: weekId ?? null,
		gradeId: gradeId ?? null,
	});

	// Handle filter changes and propagate them via callback
	const handleFilterChange = (field: string, value: any) => {
		const updatedFilters = { ...filters, [field]: value };
		setFilters(updatedFilters);
		if (onFilterChange) {
			onFilterChange(updatedFilters.weekId, updatedFilters.gradeId);
		}
	};

	const handleReset = () => {
		setFilters({ weekId: null, gradeId: null });
		if (onFilterChange) {
			onFilterChange(null, null);
		}
		if (onReset) onReset();
	};

	return (
		<div className='flex flex-col p-6 rounded-xl border my-2 w-full'>
			<span className='font-header'>Lọc dữ liệu</span>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(() => {})} className='space-y-8'>
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
