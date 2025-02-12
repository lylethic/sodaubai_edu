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

interface FilterProps {
	schoolId: number | null;
	onFilterChange?: (schoolId: number | null) => void;
	onReset?: () => void;
}

export default function FilterAccountBySchool({
	schoolId,
	onFilterChange,
	onReset,
}: FilterProps) {
	const form = useForm();

	// Initialize state with initial filters or default values
	const [filters, setFilters] = useState({
		schoolId: schoolId ?? null,
	});

	// Handle filter changes and propagate them via callback
	const handleFilterChange = (field: string, value: any) => {
		const updatedFilters = { ...filters, [field]: value };
		setFilters(updatedFilters);
		if (onFilterChange) {
			onFilterChange(updatedFilters.schoolId);
		}
	};
	const handleReset = () => {
		setFilters({ schoolId: null });
		if (onFilterChange) {
			onFilterChange(null);
		}
		if (onReset) onReset();
	};

	return (
		<div className='w-full my-6 p-4 border rounded-xl'>
			<h1 className='text-sm font-medium my-2 border-b p-2'>
				Lọc dữ liệu theo trường học:
			</h1>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(() => {})}>
					<FormField
						control={form.control}
						name='schoolId'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Trường học</FormLabel>
								<SchoolSelect
									selectedSchoolId={schoolId}
									onSelectSchool={(schoolId) =>
										handleFilterChange('schoolId', schoolId)
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
