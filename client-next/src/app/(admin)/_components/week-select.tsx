import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Ban, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';
import { WeekResType } from '@/schemaValidations/week.schema';
import { weekApiRequest } from '@/apiRequests/week';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
interface SchoolSelectProps {
	selectedWeekId: number | null;
	onSelectWeek: (weekId: number) => void;
}

const WeekSelect = ({ selectedWeekId, onSelectWeek }: SchoolSelectProps) => {
	const [weeks, setWeeks] = useState<WeekResType['data'][]>([]);

	const { setValue } = useFormContext();

	useEffect(() => {
		const getWeeksList = async () => {
			try {
				const response = await weekApiRequest.weeksNoPagination();
				const data = response.payload.data;
				const result = Array.isArray(data) ? data : [];
				setWeeks(result);
			} catch (error) {}
		};
		getWeeksList();
	}, []);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' className='w-full justify-between'>
					{weeks.find((item) => item.weekId === selectedWeekId)?.weekName ||
						'Chọn tuần học...'}
					<ChevronsUpDown className='ml-2 h-4 w-4 opacity-50' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-full max-h-60 overflow-y-auto'>
				{weeks.map((key) => (
					<DropdownMenuItem
						key={key.weekId}
						onClick={() => {
							onSelectWeek(key.weekId);
							setValue('weekId', key.weekId);
						}}
					>
						<Check
							className={cn(
								'mr-2 h-4 w-4',
								key.weekId === selectedWeekId ? 'opacity-100' : 'opacity-0'
							)}
						/>
						<div className='w-full flex items-center justify-between'>
							{key.weekName}
							<Ban
								color='red'
								className={cn(
									'ml-2 h-4 w-4',
									key.status === false ? 'opacity-100' : 'opacity-0'
								)}
							/>
						</div>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default WeekSelect;
