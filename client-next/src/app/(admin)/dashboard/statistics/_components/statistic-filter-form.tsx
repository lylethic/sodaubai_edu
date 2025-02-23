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

interface FilterProps {
	weekId: number | null;
	onFilterChange?: (weekId: number | null) => void;
	onReset?: () => void;
}

export default function FilteWeek({
	weekId,
	onFilterChange,
	onReset,
}: FilterProps) {
	const form = useForm();

	// Initialize state with initial filters or default values
	const [filters, setFilters] = useState({
		weekId: weekId ?? null,
	});

	// Handle filter changes and propagate them via callback
	const handleFilterChange = (field: string, value: any) => {
		const updatedFilters = { ...filters, [field]: value };
		setFilters(updatedFilters);
		if (onFilterChange) {
			onFilterChange(updatedFilters.weekId);
		}
	};

	const handleReset = () => {
		setFilters({ weekId: null });
		if (onFilterChange) {
			onFilterChange(null);
		}
		if (onReset) onReset();
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
