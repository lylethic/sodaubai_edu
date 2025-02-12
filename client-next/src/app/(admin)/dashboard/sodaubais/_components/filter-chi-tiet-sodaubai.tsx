import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import NamHocSelect from '@/app/(admin)/_components/namHoc-select';
import WeekSelect from '@/app/(admin)/_components/week-select';
import SemesterSelect from '@/app/(admin)/_components/semester-select';

interface FilterProps {
	initialFilters?: {
		academicYearId: number | null;
		semesterId: number | null;
		weekId: number | null;
	};
	onFilterChange?: (filters: {
		academicYearId: number | null;
		semesterId: number | null;
		weekId: number | null;
	}) => void;
}

export default function FilterChiTietSodauBai({
	initialFilters,
	onFilterChange,
}: FilterProps) {
	const form = useForm();

	// Initialize state with initial filters or default values
	const [filters, setFilters] = useState({
		academicYearId: initialFilters?.academicYearId ?? null,
		semesterId: initialFilters?.semesterId ?? null,
		weekId: initialFilters?.weekId ?? null,
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
						name='academicYearId'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Năm học</FormLabel>
								<NamHocSelect
									selectedNamHoc={filters.academicYearId}
									onSelectedNamHoc={(id) =>
										handleFilterChange('academicYearId', id)
									}
								/>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='semesterId'
						render={({ field }) => (
							<FormItem className='space-y-2'>
								<FormLabel>Học kỳ</FormLabel>
								<SemesterSelect
									selected={filters.semesterId}
									onSelectedSemester={(id) =>
										handleFilterChange('semesterId', id)
									}
								/>
								<FormMessage />
							</FormItem>
						)}
					/>
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
				</form>
			</Form>
		</div>
	);
}
