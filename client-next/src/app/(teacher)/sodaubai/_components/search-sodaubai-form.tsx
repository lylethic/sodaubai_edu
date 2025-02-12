import React, { useState } from 'react';
import {
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { FormProvider, useForm } from 'react-hook-form';
import LopHocSelect from '@/app/(admin)/_components/lopHoc-select';
import { Button } from '@/components/ui/button';

interface FilterProps {
	schoolId: number;
	classId: number | null;
	onFilterChange?: (classId: number | null) => void;
	onReset?: () => void;
}

export default function SodauBaiSearchForm({
	schoolId,
	classId,
	onFilterChange,
	onReset,
}: FilterProps) {
	const form = useForm();

	const [filters, setFilters] = useState({
		classId: classId ?? null,
	});

	// Handle filter changes and propagate them via callback
	const handleFilterChange = (field: string, value: any) => {
		const updatedFilters = { ...filters, [field]: value };
		setFilters(updatedFilters);
		if (onFilterChange) {
			onFilterChange(updatedFilters.classId);
		}
	};

	const handleReset = () => {
		setFilters({ classId: null });
		if (onFilterChange) {
			onFilterChange(null);
		}
		if (onReset) onReset();
	};

	return (
		<div className='flex flex-col justify-center w-full my-6 p-4 border rounded-xl'>
			<h1 className='font-header'>Lọc sổ đầu bài:</h1>
			<FormProvider {...form}>
				<form onSubmit={form.handleSubmit(() => {})}>
					<FormField
						control={form.control}
						name='classId'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Lớp học</FormLabel>
								<LopHocSelect
									selectedClassId={filters.classId}
									selectedSchoolId={schoolId}
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
