'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { handleErrorApi } from '@/lib/utils';
import DataTable from '@/app/(admin)/_components/data-table';
import {
	SemesterListResType,
	SemesterResType,
} from '@/schemaValidations/semester.schema';
import { semesterApiRequest } from '@/apiRequests/semester';
import { QueryType } from '@/types/queryType';
import { getSemesterColumns } from './columns';
import SemesterAddButton from './semester-add-button';
import SemesterDeleteDialog from './semester-delete-dialog';
import BulkSemesterAcademicYearDialog from './semester-bulk-delete-dialog';
import SemesterUploadButton from './semester-upload-button';

type SemesterType = SemesterResType['data'];

interface SemestersListProps {
	initialSemesters?: SemesterType[];
	initialTotalCount?: number;
}

export default function SemestersList({
	initialSemesters = [],
	initialTotalCount = 0,
}: SemestersListProps) {
	const router = useRouter();
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState<SemesterType[]>([]);

	const [pageNumber, setPageNumber] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);

	const [totalPageCount, setTotalPageCount] =
		useState<number>(initialTotalCount);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [rowToDelete, setRowToDelete] = useState<SemesterType | null>(null);

	const [data, setData] = useState<SemesterType[]>(initialSemesters);
	const isFirstMount = React.useRef(true);

	const fetchData = async (query: QueryType) => {
		setLoading(true);
		try {
			const response = await semesterApiRequest.semesters(query);
			const payload = response.payload as any;
			const items =
				payload?.data?.items ||
				(Array.isArray(payload?.data) ? payload.data : []);
			const totalResults =
				payload?.data?.totalCount ??
				payload?.pagination?.totalResults ??
				0;
			setData(items);
			setTotalPageCount(totalResults);
		} catch (error) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (isFirstMount.current) {
			isFirstMount.current = false;
			if (initialSemesters.length > 0 && pageNumber === 1 && pageSize === 20) {
				return;
			}
		}
		fetchData({ pageNumber, pageSize });
	}, [pageNumber, pageSize]);

	const handleEdit = useCallback(
		(data: SemesterType) =>
			router.push(`/dashboard/semesters/${data.semesterId ?? data.id}/edit`),
		[]
	);

	const handleDelete = useCallback((data: SemesterType) => {
		setRowToDelete(data);
		setIsDialogOpen(true);
	}, []);

	const confirmDelete = async () => {
		if (!rowToDelete) return;
		try {
			const id = rowToDelete.semesterId ?? rowToDelete.id;
			const response = await semesterApiRequest.delete(id!);
			toast({
				description: response.payload.message,
			});

			// Update state lopHocs
			setData((prev) =>
				prev.filter((item) => (item.semesterId ?? item.id) !== id)
			);
		} catch (error) {
			handleErrorApi({ error });
		} finally {
			setIsDialogOpen(false);
			setRowToDelete(null);
		}
	};

	const handleRedirectToDetail = useCallback(
		(data: SemesterType) =>
			router.push(`/dashboard/semesters/${data.semesterId ?? data.id}`),
		[]
	);

	const handleRefresh = useCallback(() => {
		fetchData({ pageNumber, pageSize });
	}, [pageNumber, pageSize]);

	const columns = useMemo(
		() =>
			getSemesterColumns({
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
			<SemesterAddButton />
			<SemesterUploadButton onRefresh={handleRefresh} />
			<BulkSemesterAcademicYearDialog
				selectedItems={selected.map((items) => (items.semesterId ?? items.id)!)}
				onDeleted={handleRefresh}
			/>
			<DataTable
				data={data}
				columns={columns}
				pageNumber={pageNumber}
				pageSize={pageSize}
				totalCount={totalPageCount}
				onPageChange={setPageNumber}
				onPageSizeChange={setPageSize}
				onSelectedRowsChange={setSelected}
			/>

			<SemesterDeleteDialog
				isDialogOpen={isDialogOpen}
				setIsDialogOpen={(value) => setIsDialogOpen(value)}
				onConfirmDelete={confirmDelete}
			/>
		</>
	);
}
