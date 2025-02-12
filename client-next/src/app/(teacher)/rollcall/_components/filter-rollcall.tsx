import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import WeekSelect from '@/app/(admin)/_components/week-select';
import SchoolSelect from '@/app/(admin)/_components/school-select';
import LopHocSelect from '@/app/(admin)/_components/lopHoc-select';

interface FilterProps {
	schoolId: number | null;
	initialFilters?: {
		weekId: number | null;
		classId: number | null;
	};
	onFilterChange?: (filters: {
		weekId: number | null;
		classId: number | null;
	}) => void;
}

export default function FilterRollCall({
	schoolId,
	initialFilters,
	onFilterChange,
}: FilterProps) {
	const form = useForm();
	// Initialize state with initial filters or default values
	const [filters, setFilters] = useState({
		weekId: initialFilters?.weekId ?? null,
		classId: initialFilters?.classId ?? null,
	});

	// Handle filter changes and propagate them via callback
	const handleFilterChange = (field: string, value: any) => {
		const updatedFilters = { ...filters, [field]: value };
		setFilters(updatedFilters);
		if (onFilterChange) {
			onFilterChange(updatedFilters);
		}
	};

	return (
		<div className='flex flex-col p-6 rounded-xl border my-2 w-full'>
			<span className='font-header'>Vui lòng chọn mốc thời gian</span>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(() => {})} className='space-y-8'>
					<FormField
						control={form.control}
						name='weekId'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Tuần học</FormLabel>
								<WeekSelect
									selectedWeekId={filters.weekId}
									onSelectWeek={(id) => handleFilterChange('weekId', id)}
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
									selectedSchoolId={schoolId ?? 0}
									selectedClassId={filters.classId}
									onSelectedLopHoc={(classId) =>
										handleFilterChange('classId', classId)
									}
								/>
								<FormMessage />
							</FormItem>
						)}
					/>
				</form>
			</Form>
		</div>
	);
}
