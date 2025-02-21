'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { handleErrorApi } from '@/lib/utils';
import { WeeklyStatisticsType } from '@/schemaValidations/weekly-statistics';
import { weeklyStatisticsApiRequest } from '@/apiRequests/weeklyStatistics';

type WeeklyStatistic = WeeklyStatisticsType['data'];

export default function StatisticsList() {
	const [data, setData] = useState<WeeklyStatistic[]>([]);
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
			const { payload } = await weeklyStatisticsApiRequest.weeklyEvaluations(
				week
			);
			setData(Array.isArray(payload.data) ? payload.data : []);
		} catch (error) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {}, []);
	return <div></div>;
}
