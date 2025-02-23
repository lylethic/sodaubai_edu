'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { handleErrorApi } from '@/lib/utils';
import {
	ViewScoreListByWeekResType,
	WeeklyStatisticsType,
} from '@/schemaValidations/weekly-statistics';
import { weeklyStatisticsApiRequest } from '@/apiRequests/weeklyStatistics';
import FilteWeek from './statistic-filter-form';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';

type WeeklyStatistic = WeeklyStatisticsType['data'];
type WeeklyStatisticByWeek = ViewScoreListByWeekResType['data'];

export default function StatisticsList() {
	const [data, setData] = useState<WeeklyStatisticByWeek[]>([]);
	const router = useRouter();
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [rowToDelete, setRowToDelete] = useState<WeeklyStatistic | null>(null);
	const [selectedWeek, setSelectedWeek] = useState<number>(0);

	// This is use for delete 1.
	const [selected, setSelected] = useState<WeeklyStatistic[]>([]);
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [totalPageCount, setTotalPageCount] = useState<number>(0);

	const fetchData = async (week: number) => {
		setLoading(true);
		try {
			const { payload } = await weeklyStatisticsApiRequest.viewScoreListByWeek(
				week
			);
			const newData = Array.isArray(payload.data) ? payload.data : [];
			setData(newData);

			if (newData.length === 0) {
				toast({
					description: 'Tuần học chưa có điểm thống kê',
				});
			}
		} catch (error) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};
	const handleFilterChange = (weekId: number | null) => {
		setSelectedWeek(weekId ?? 0);
	};

	useEffect(() => {
		console.log(data);
		fetchData(selectedWeek);
	}, [selectedWeek]);

	const chartConfig = {
		className: {
			label: 'className',
			color: 'hsl(var(--chart-1))',
		},
	} satisfies ChartConfig;

	return (
		<>
			<FilteWeek weekId={selectedWeek} onFilterChange={handleFilterChange} />

			{data.length > 0 ? (
				<Card>
					<CardHeader>
						<CardTitle>Biểu đồ thống kê điểm thi đua theo tuần</CardTitle>
					</CardHeader>

					<CardContent>
						<ChartContainer config={chartConfig}>
							<BarChart accessibilityLayer data={data}>
								<CartesianGrid vertical={false} />
								<XAxis
									dataKey='className'
									tickLine={false}
									tickMargin={10}
									axisLine={false}
								/>
								<ChartTooltip
									cursor={false}
									content={<ChartTooltipContent indicator='dashed' />}
								/>

								<Bar
									dataKey='totalScore'
									name='Tổng Điểm'
									fill='#4F46E5'
									radius={4}
								>
									<LabelList
										position='top'
										offset={12}
										className='fill-foreground'
										fontSize={12}
									/>
								</Bar>
							</BarChart>
						</ChartContainer>
					</CardContent>
					<CardFooter className='flex-col items-start gap-2 text-sm'></CardFooter>
				</Card>
			) : (
				<div className='font-medium text-lg'>
					Vui lòng chọn tuần học để thống kê biểu đồ điểm!
				</div>
			)}
		</>
	);
}
