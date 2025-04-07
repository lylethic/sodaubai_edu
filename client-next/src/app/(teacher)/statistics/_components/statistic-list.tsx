'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { handleErrorApi } from '@/lib/utils';
import { ViewScoreListByWeekResType } from '@/schemaValidations/weekly-statistics';
import { weeklyStatisticsApiRequest } from '@/apiRequests/weeklyStatistics';
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
import { useAppContext } from '@/app/app-provider';
import TeacherFilterStatisticByWeekPage from '@/app/(admin)/dashboard/statistics/_components/filter-statistic-form';

type WeeklyStatisticByWeek = ViewScoreListByWeekResType['data'];

export default function TeacherStatisticsList() {
	const router = useRouter();
	const { user } = useAppContext();

	const [data, setData] = useState<WeeklyStatisticByWeek[]>([]);
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [selectedWeek, setSelectedWeek] = useState<number>(0);
	const [selectedGrade, setSelectedGrade] = useState<number>(0);

	// admin 1 school
	const schoolIdFromAppContext = Number(user?.schoolId);
	const roleIdFromAppContext = Number(user?.roleId);

	const fetchData = async (weekId: number, gradeId: number) => {
		setLoading(true);
		setData([]);
		try {
			const { payload } = await weeklyStatisticsApiRequest.viewScoreListByWeek(
				schoolIdFromAppContext,
				weekId,
				gradeId
			);

			const newData = Array.isArray(payload.data) ? payload.data : [];
			setData(newData);

			if (newData.length === 0) {
				toast({
					description: 'Chưa có điểm thống kê',
				});
			}
		} catch (error) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	const handleFilterChange = (
		weekId: number | null,
		gradeId: number | null
	) => {
		setSelectedWeek(weekId ?? 0);
		setSelectedGrade(gradeId ?? 0);
	};

	useEffect(() => {
		if (loading) return;
		fetchData(selectedWeek, selectedGrade);
	}, [selectedWeek, selectedGrade]);

	const chartConfig = {
		className: {
			label: 'className',
			color: 'hsl(var(--chart-1))',
		},
	} satisfies ChartConfig;

	return (
		<>
			<TeacherFilterStatisticByWeekPage
				weekId={selectedWeek}
				gradeId={selectedGrade}
				onFilterChange={handleFilterChange}
			/>

			{data.length > 0 ? (
				<Card className='w-1/2 h-1/2'>
					<CardHeader>
						<CardTitle>Biểu đồ cột</CardTitle>
						<CardDescription>
							Biểu đồ thống kê điểm thi đua theo tuần
						</CardDescription>
					</CardHeader>

					<CardContent>
						<ChartContainer config={chartConfig}>
							<BarChart
								data={data}
								barSize={16} // 1rem width
								height={150} // reduce height of chart
								className='w-full'
							>
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
				<div className='font-medium'>
					Vui lòng chọn dữ liệu để thống kê biểu đồ điểm!
				</div>
			)}
		</>
	);
}
