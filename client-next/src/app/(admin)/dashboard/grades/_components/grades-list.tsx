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

interface GradesListProps {
	initialGrades?: GradeType[];
	initialTotalCount?: number;
}

export default function GradesList({
	initialGrades = [],
	initialTotalCount = 0,
}: GradesListProps) {
	const router = useRouter();
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState<GradeType[]>([]);

	const [datas, setDatas] = useState<GradeType[]>(initialGrades);
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [totalPageCount, setTotalPageCount] =
		useState<number>(initialTotalCount);
	const isFirstMount = React.useRef(true);

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [rowToDelete, setRowToDelete] = useState<GradeType | null>(null);

	const fetchData = async (query: QueryType) => {
		if (loading) return;
		setLoading(true);
		try {
			const response = await gradeApiRequest.grades(query);

			const payload = response.payload as any;
			const items =
				payload?.data?.items ||
				(Array.isArray(payload?.data) ? payload.data : []);
			const totalResults =
				payload?.data?.totalCount ??
				payload?.pagination?.totalResults ??
				0;

			setDatas(items);
			setTotalPageCount(totalResults);
		} catch (error) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = useCallback(
		(data: GradeType) =>
			router.push(`/dashboard/grades/${data.gradeId || data.id}/edit`),
		[router]
	);

	const handleDelete = useCallback((data: GradeType) => {
		setRowToDelete(data);
		setIsDialogOpen(true);
	}, []);

	const confirmDelete = async () => {
		if (!rowToDelete) return;
		try {
			const idToDelete = rowToDelete.gradeId || rowToDelete.id || 0;
			const response = await gradeApiRequest.delete(idToDelete);
			toast({
				description: response.payload.message,
			});

			setDatas((prev) =>
				prev.filter(
					(item) =>
						(item.gradeId || item.id) !== idToDelete
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
		(data: GradeType) =>
			router.push(`/dashboard/grades/${data.gradeId || data.id}`),
		[router]
	);

	const handleRefresh = useCallback(() => {
		fetchData({ pageNumber, pageSize });
	}, [pageNumber, pageSize]);

	useEffect(() => {
		if (isFirstMount.current) {
			isFirstMount.current = false;
			return;
		}
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
		[
			handleEdit,
			handleDelete,
			handleRedirectToDetail,
			pageNumber,
			pageSize,
		]
	);

	return (
		<div className='p-4'>
			<div className='flex justify-between items-center'>
				<GradeAddButton />
				<div className='flex gap-2 items-center'>
					<GradeBulkDelete
						onDeleted={handleRefresh}
						selectedItems={selected.map(
							(item) => item.gradeId || item.id || 0
						)}
					/>
					<GradeUploadButton onRefresh={handleRefresh} />
				</div>
			</div>
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
		</div>
	);
}
