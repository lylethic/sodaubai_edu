import React, { useState } from 'react';
import {
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { FormProvider, useForm } from 'react-hook-form';
import SchoolSelect from '@/app/(admin)/_components/school-select';
import LopHocSelect from '@/app/(admin)/_components/lopHoc-select';
import { Button } from '@/components/ui/button';

interface FilterProps {
	initialFilters?: {
		schoolId: number | null;
		classId: number | null;
	};
	onFilterChange?: (filters: {
		schoolId: number | null;
		classId: number | null;
	}) => void;
	onReset?: () => void;
}

export default function SodauBaiSearchForm({
	initialFilters,
	onFilterChange,
	onReset,
}: FilterProps) {
	const form = useForm();

	const [filters, setFilters] = useState({
		schoolId: initialFilters?.schoolId ?? null,
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
	const handleReset = () => {
		setFilters({ schoolId: null, classId: null });
		if (onFilterChange) {
			onFilterChange({ schoolId: null, classId: null });
		}
		if (onReset) onReset();
	};

	return (
		<div className='flex flex-col justify-center w-full my-6 p-4 border rounded-xl'>
			<h4 className='font-header'>Lọc sổ đầu bài:</h4>
			<FormProvider {...form}>
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
			</FormProvider>
		</div>
	);
}
