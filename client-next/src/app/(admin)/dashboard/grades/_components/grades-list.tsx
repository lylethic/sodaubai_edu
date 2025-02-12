'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { handleErrorApi } from '@/lib/utils';
import DataTable from '@/app/(admin)/_components/data-table';
import { QueryType } from '@/types/queryType';
import { GradeResType } from '@/schemaValidations/grade.schema';
import { gradeApiRequest } from '@/apiRequests/grade';
import { getGradesColumns } from './columns';
import GradeDeleteDialog from './grade-delete-dialog';
import GradeBulkDelete from './grade-bulk-delete-dialog';
import GradeAddButton from './grade-add-button';
import GradeUploadButton from './grade-upload';

type GradeType = GradeResType['data'];

export default function GradesList() {
	const router = useRouter();
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState<GradeType[]>([]);

	const [datas, setDatas] = useState<GradeType[]>([]);
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [totalPageCount, setTotalPageCount] = useState<number>(0);

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [rowToDelete, setRowToDelete] = useState<GradeType | null>(null);

	const fetchData = async (query: QueryType) => {
		setLoading(true);
		try {
			const response = await gradeApiRequest.grades(query);

			const { data, pagination } = response.payload;

			const totalResults = pagination?.totalResults;

			setDatas(Array.isArray(data) ? data : []);
			setTotalPageCount(totalResults ?? 0);
		} catch (error) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = useCallback(
		(data: GradeType) => router.push(`/dashboard/grades/${data.gradeId}/edit`),
		[]
	);

	const handleDelete = useCallback((data: GradeType) => {
		setRowToDelete(data);
		setIsDialogOpen(true);
	}, []);

	const confirmDelete = async () => {
		if (!rowToDelete) return;
		try {
			const response = await gradeApiRequest.delete(rowToDelete.gradeId);
			toast({
				description: response.payload.message,
			});

			// Update state lopHocs
			setDatas((prev) =>
				prev.filter((item) => item.gradeId !== rowToDelete.gradeId)
			);
		} catch (error) {
			handleErrorApi({ error });
		} finally {
			setIsDialogOpen(false);
			setRowToDelete(null);
		}
	};

	const handleRedirectToDetail = useCallback(
		(data: GradeType) => router.push(`/dashboard/grades/${data.gradeId}`),
		[]
	);

	const handleRefresh = useCallback(() => {
		fetchData({ pageNumber, pageSize });
	}, [pageNumber, pageSize]);

	useEffect(() => {
		if (loading) return;
		fetchData({ pageNumber, pageSize });
	}, [pageNumber, pageSize]);

	const columns = useMemo(
		() =>
			getGradesColumns({
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
			<GradeAddButton />
			<GradeUploadButton onRefresh={handleRefresh} />
			<GradeBulkDelete
				selectedItems={selected.map((key) => key.gradeId)}
				onDeleted={handleRefresh}
			/>
			<DataTable
				columns={columns}
				data={datas}
				pageNumber={pageNumber}
				pageSize={pageSize}
				totalCount={totalPageCount}
				onPageChange={setPageNumber}
				onPageSizeChange={setPageSize}
				onSelectedRowsChange={setSelected}
			/>
			<GradeDeleteDialog
				isDialogOpen={isDialogOpen}
				setIsDialogOpen={setIsDialogOpen}
				onConfirmDelete={confirmDelete}
			/>
		</>
	);
}
