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

export default function SchoolYearsList() {
	const router = useRouter();
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState<AcademicYearType[]>([]);
	const [academicYears, setAcademicYears] = useState<AcademicYearType[]>([]);
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [totalPageCount, setTotalPageCount] = useState<number>(0);

	const [rowToDelete, setRowToDelete] = useState<AcademicYearType | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const fetchData = async (query: QueryType) => {
		if (loading) return;
		setLoading(true);
		try {
			const { payload } = await namHocApiRequest.namHocs(query);
			const result = payload.data;
			const totalResults = payload.pagination?.totalResults;

			setAcademicYears(Array.isArray(result) ? result : []);
			setTotalPageCount(totalResults ?? 0);
		} catch (error) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = useCallback(
		(data: AcademicYearType) =>
			router.push(`/dashboard/academicyears/${data.academicYearId}/edit`),
		[]
	);

	const handleDelete = useCallback((data: AcademicYearType) => {
		setRowToDelete(data);
		setIsDialogOpen(true);
	}, []);

	const confirmDelete = async () => {
		if (!rowToDelete) return;
		try {
			const { payload } = await namHocApiRequest.delete(
				rowToDelete.academicYearId
			);
			toast({
				description: payload.message,
			});

			// Update state
			setAcademicYears((prev) =>
				prev.filter(
					(item) => item.academicYearId !== rowToDelete.academicYearId
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
			router.push(`/dashboard/academicyears/${data.academicYearId}`),
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
				selectedItems={selected.map((items) => items.academicYearId)}
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
