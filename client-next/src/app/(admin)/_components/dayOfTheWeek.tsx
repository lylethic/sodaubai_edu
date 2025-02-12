import React from 'react';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

interface DayOfTheWeekProps {
	value: string;
	onChange: (value: string) => void;
}

export default function DayOfTheWeek({ value, onChange }: DayOfTheWeekProps) {
	const data = [
		{ id: 1, day: 'thứ 2 (sáng)' },
		{ id: 2, day: 'thứ 2 (chiều)' },
		{ id: 3, day: 'thứ 2 (tối)' },
		{ id: 4, day: 'thứ 3 (sáng)' },
		{ id: 5, day: 'thứ 3 (chiều)' },
		{ id: 6, day: 'thứ 3 (tối)' },
		{ id: 7, day: 'thứ 4 (sáng)' },
		{ id: 8, day: 'thứ 4 (chiều)' },
		{ id: 9, day: 'thứ 4 (tối)' },
		{ id: 10, day: 'thứ 5 (sáng)' },
		{ id: 11, day: 'thứ 5 (chiều)' },
		{ id: 12, day: 'thứ 5 (tối)' },
		{ id: 13, day: 'thứ 6 (sáng)' },
		{ id: 14, day: 'thứ 6 (chiều)' },
		{ id: 15, day: 'thứ 6 (tối)' },
		{ id: 16, day: 'thứ 7 (sáng)' },
		{ id: 17, day: 'thứ 7 (chiều)' },
		{ id: 18, day: 'thứ 7 (tối)' },
		{ id: 19, day: 'chủ nhật (sáng)' },
		{ id: 20, day: 'chủ nhật (chiều)' },
		{ id: 21, day: 'chủ nhật (tối)' },
	];

	return (
		<Select value={value} onValueChange={onChange}>
			<SelectTrigger className='w-[180px]'>
				<SelectValue placeholder='Chọn ngày' />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Chọn ngày</SelectLabel>
					{data.map((item) => (
						<SelectItem key={item.id} value={item.day}>
							{item.day}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
