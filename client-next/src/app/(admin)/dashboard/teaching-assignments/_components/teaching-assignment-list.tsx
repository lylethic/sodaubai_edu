'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { handleErrorApi } from '@/lib/utils';
import { phanCongGiangDayApiRequest } from '@/apiRequests/phanCongGiangDay';
import { PhanCongGiangDayResType } from '@/schemaValidations/phanCongGiangDayBia';
import { QueryType } from '@/types/queryType';
import DataTable from '@/app/(admin)/_components/data-table';
import { getPhanCongGiangDayColumns } from './columns';
import LoadingSpinner from '../../loading';
import TeachingAssignmentAddButton from './teaching-assignment-add-button';
import DeleteTeachingAssignment from './delete-dialog';
import BulkDeleteTeachingAssingmentsButton from './bulk-delete';

type PhanCongGiangDayType = PhanCongGiangDayResType['data'];

export default function TeachingAssignmentList() {
	const [phanCongGiangDays, setPhanCongGiangDays] = useState<
		PhanCongGiangDayType[]
	>([]);
	const router = useRouter();
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [rowToDelete, setRowToDelete] = useState<PhanCongGiangDayType | null>(
		null
	);

	// This is use for delete 1.
	const [selected, setSelected] = useState<PhanCongGiangDayType[]>([]);
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [totalPageCount, setTotalPageCount] = useState<number>(0);

	const fetchData = async (page: QueryType) => {
		setLoading(true);
		try {
			const { payload } = await phanCongGiangDayApiRequest.phanCongGiangDays(
				page
			);
			const totalResults = payload.pagination?.totalResults ?? 0;
			setPhanCongGiangDays(Array.isArray(payload.data) ? payload.data : []);
			setTotalPageCount(totalResults);
		} catch (error) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = useCallback(
		(data: PhanCongGiangDayType) =>
			router.push(
				`/dashboard/teaching-assignments/${data.phanCongGiangDayId}/edit`
			),
		[]
	);

	const handleDelete = useCallback((data: PhanCongGiangDayType) => {
		setRowToDelete(data);
		setIsDialogOpen(true);
	}, []);

	const confirmDelete = async () => {
		if (!rowToDelete) return;
		try {
			const response = await phanCongGiangDayApiRequest.delete(
				rowToDelete.phanCongGiangDayId
			);
			toast({
				description: response.payload.message,
			});

			// Update state lopHocs
			setPhanCongGiangDays((prev) =>
				prev.filter(
					(item) => item.phanCongGiangDayId !== rowToDelete.phanCongGiangDayId
				)
			);
		} catch (error) {
			handleErrorApi({ error });
		} finally {
			setIsDialogOpen(false);
			setRowToDelete(null);
		}
	};

	const handleRedirectToDetail = useCallback(
		(data: PhanCongGiangDayType) =>
			router.push(`/dashboard/teaching-assignments/${data.phanCongGiangDayId}`),
		[]
	);

	const handleRefresh = useCallback(() => {
		fetchData({ pageNumber, pageSize });
	}, [pageNumber, pageSize]);

	useEffect(() => {
		fetchData({ pageNumber, pageSize });
	}, [pageNumber, pageSize]);

	const columns = useMemo(
		() =>
			getPhanCongGiangDayColumns({
				handleEdit,
				handleDelete,
				handleRedirectToDetail,
				pageNumber,
				pageSize,
			}),
		[]
	);

	if (loading) return <LoadingSpinner />;

	return (
		<div>
			<TeachingAssignmentAddButton />
			<BulkDeleteTeachingAssingmentsButton
				selectedItems={selected.map((key) => key.phanCongGiangDayId)}
				onDeleted={handleRefresh}
			/>
			<DataTable
				columns={columns}
				data={phanCongGiangDays}
				pageNumber={pageNumber}
				pageSize={pageSize}
				totalCount={totalPageCount}
				onPageChange={setPageNumber}
				onPageSizeChange={setPageSize}
				onSelectedRowsChange={setSelected}
			/>
			<DeleteTeachingAssignment
				isDialogOpen={isDialogOpen}
				setIsDialogOpen={(value) => setIsDialogOpen(value)}
				onConfirmDelete={confirmDelete}
			/>
		</div>
	);
}
