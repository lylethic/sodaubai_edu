'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { handleErrorApi } from '@/lib/utils';
import DataTable from '@/app/(admin)/_components/data-table';
import { QueryType } from '@/types/queryType';
import { namHocApiRequest } from '@/apiRequests/namHoc';
import { AcademicYearResType } from '@/schemaValidations/academicYear.schema';
import { getAcademicYearColumns } from './columns';
import AcademicYearAddButton from './academicyear-add-button';
import AcademicYearDeleteDialog from './delete-acdemicyear-dialog';
import BulkDeleteAcademicYearDialog from './bulk-delete-academic-year-dialog';
import AcademicYearUploadButton from './academicYear-upload-button';

type AcademicYearType = AcademicYearResType['data'];

interface SchoolYearsListProps {
	initialAcademicYears?: AcademicYearType[];
	initialTotalCount?: number;
}

export default function SchoolYearsList({
	initialAcademicYears = [],
	initialTotalCount = 0,
}: SchoolYearsListProps) {
	const router = useRouter();
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState<AcademicYearType[]>([]);
	const [academicYears, setAcademicYears] =
		useState<AcademicYearType[]>(initialAcademicYears);
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [totalPageCount, setTotalPageCount] =
		useState<number>(initialTotalCount);
	const isFirstMount = React.useRef(true);

	const [rowToDelete, setRowToDelete] = useState<AcademicYearType | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const fetchData = async (query: QueryType) => {
		if (loading) return;
		setLoading(true);
		try {
			const { payload } = await namHocApiRequest.namHocs(query);
			const items = (payload as any)?.data?.items || (Array.isArray(payload?.data) ? payload.data : []);
			const totalResults = (payload as any)?.data?.totalCount ?? (payload as any)?.pagination?.totalResults ?? 0;

			setAcademicYears(items);
			setTotalPageCount(totalResults);
		} catch (error) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = useCallback(
		(data: AcademicYearType) =>
			router.push(`/dashboard/academicyears/${data.id ?? data.academicYearId}/edit`),
		[]
	);

	const handleDelete = useCallback((data: AcademicYearType) => {
		setRowToDelete(data);
		setIsDialogOpen(true);
	}, []);

	const confirmDelete = async () => {
		if (!rowToDelete) return;
		try {
			const id = rowToDelete.id ?? rowToDelete.academicYearId;
			const { payload } = await namHocApiRequest.delete(id);
			toast({
				description: payload.message,
			});

			// Update state
			setAcademicYears((prev) =>
				prev.filter(
					(item) => (item.id ?? item.academicYearId) !== id
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
		(data: AcademicYearType) =>
			router.push(`/dashboard/academicyears/${data.id ?? data.academicYearId}`),
		[]
	);

	const handleRefresh = useCallback(() => {
		fetchData({ pageNumber, pageSize });
	}, [pageNumber, pageSize]);

	useEffect(() => {
		if (isFirstMount.current) {
			isFirstMount.current = false;
			if (initialAcademicYears.length > 0 && pageNumber === 1 && pageSize === 20) {
				return;
			}
		}
		fetchData({ pageNumber, pageSize });
	}, [pageNumber, pageSize]);

	const columns = useMemo(
		() =>
			getAcademicYearColumns({
				handleEdit,
				handleDelete,
				handleRedirectToDetail,
				pageNumber,
				pageSize,
			}),
		[handleEdit, handleDelete, handleRedirectToDetail, pageNumber, pageSize]
	);

	return (
		<div>
			<AcademicYearUploadButton />
			<AcademicYearAddButton />

			<BulkDeleteAcademicYearDialog
				selectedItems={selected.map((items) => (items.id ?? items.academicYearId)!)}
				onDeleted={handleRefresh}
			/>

			<DataTable
				columns={columns}
				data={academicYears}
				pageNumber={pageNumber}
				pageSize={pageSize}
				totalCount={totalPageCount}
				onPageChange={setPageNumber}
				onPageSizeChange={setPageSize}
				onSelectedRowsChange={setSelected}
			/>

			<AcademicYearDeleteDialog
				isDialogOpen={isDialogOpen}
				setIsDialogOpen={(value) => setIsDialogOpen(value)}
				onConfirmDelete={confirmDelete}
			/>
		</div>
	);
}
