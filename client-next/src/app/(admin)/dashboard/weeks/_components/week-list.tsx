'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WeekResType } from '@/schemaValidations/week.schema';
import { useToast } from '@/hooks/use-toast';
import { getWeekColumns } from './columns';
import DataTable from '@/app/(admin)/_components/data-table';
import { QueryType } from '@/types/queryType';
import { handleErrorApi } from '@/lib/utils';
import { weekApiRequest } from '@/apiRequests/week';
import WeekAddButton from './week-add-button';
import DeleteWeekDialog from './delete-week-dialog';
import BulkDeleteWeeks from './bulk-delete-week-dialog';

type WeekType = WeekResType['data'];

interface WeekListProps {
	initialWeeks?: WeekType[];
	initialTotalCount?: number;
}

export default function WeekList({
	initialWeeks = [],
	initialTotalCount = 0,
}: WeekListProps) {
	const router = useRouter();
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState<WeekType[]>([]);
	const [weeks, setWeeks] = useState<WeekType[]>(initialWeeks);
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [totalPageCount, setTotalPageCount] =
		useState<number>(initialTotalCount);

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [rowToDelete, setRowToDelete] = useState<WeekType | null>(null);
	const isFirstMount = React.useRef(true);

	const fetchData = async (query: QueryType) => {
		setLoading(true);
		try {
			const response = await weekApiRequest.weeks(query);
			const payload = response.payload as any;
			const items =
				payload?.data?.items ||
				(Array.isArray(payload?.data) ? payload.data : []);
			const totalResults =
				payload?.data?.totalCount ??
				payload?.pagination?.totalResults ??
				0;

			setWeeks(items);
			setTotalPageCount(totalResults ?? 0);
		} catch (error) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};
	const handleEdit = useCallback(
		(data: WeekType) =>
			router.push(`/dashboard/weeks/${data.weekId ?? data.id}/edit`),
		[]
	);

	const handleDelete = useCallback((data: WeekType) => {
		setRowToDelete(data);
		setIsDialogOpen(true);
	}, []);

	const confirmDelete = async () => {
		if (!rowToDelete) return;
		try {
			const id = (rowToDelete.weekId ?? rowToDelete.id)!;
			const response = await weekApiRequest.delete(id);
			toast({
				description: response.payload.message,
			});

			// Update state
			setWeeks((prev) =>
				prev.filter((item) => (item.weekId ?? item.id) !== id)
			);
		} catch (error) {
			handleErrorApi({ error });
		} finally {
			setIsDialogOpen(false);
			setRowToDelete(null);
		}
	};

	const handleRedirectToDetail = useCallback(
		(data: WeekType) =>
			router.push(`/dashboard/weeks/${data.weekId ?? data.id}`),
		[]
	);

	const handleRefresh = useCallback(() => {
		fetchData({ pageNumber, pageSize });
	}, [pageNumber, pageSize]);

	useEffect(() => {
		if (isFirstMount.current) {
			isFirstMount.current = false;
			if (initialWeeks.length > 0 && pageNumber === 1 && pageSize === 20) {
				return;
			}
		}

		fetchData({ pageNumber, pageSize });
	}, [pageNumber, pageSize]);

	const columns = useMemo(
		() =>
			getWeekColumns({
				handleEdit,
				handleDelete,
				handleRedirectToDetail,
				pageNumber,
				pageSize,
			}),
		[handleEdit, handleDelete, handleRedirectToDetail, pageNumber, pageSize]
	);

	return (
		<>
			<WeekAddButton />
			<BulkDeleteWeeks
				selectedItems={selected.map((key) => (key.weekId ?? key.id)!)}
				onDeleted={handleRefresh}
			/>
			<DataTable
				columns={columns}
				data={weeks}
				pageNumber={pageNumber}
				pageSize={pageSize}
				totalCount={totalPageCount}
				onPageChange={setPageNumber}
				onPageSizeChange={setPageSize}
				onSelectedRowsChange={setSelected}
			/>
			<DeleteWeekDialog
				isDialogOpen={isDialogOpen}
				setIsDialogOpen={setIsDialogOpen}
				onConfirmDelete={confirmDelete}
			/>
		</>
	);
}
