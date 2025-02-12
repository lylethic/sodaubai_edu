'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { handleErrorApi } from '@/lib/utils';
import DataTable from '@/app/(admin)/_components/data-table';
import { QueryType } from '@/types/queryType';
import {
	SubjectListResType,
	SubjectResType,
} from '@/schemaValidations/subject.schema';
import { subjectApiRequest } from '@/apiRequests/subject';
import { getSubjectsColumns } from './columns';
import SubjectAddButton from './subject-add-button';
import SubjectDeleteDialog from './subject-delete-dialog';
import BulkDeleteSubjectDialog from '../../students/_components/subject-bulk-delete-dialog';
import SubjectUploadButton from './subject-upload';

type SubjectType = SubjectListResType['data'];
type SubjectObjectType = SubjectResType['data'];

export default function SubjectsList() {
	const router = useRouter();
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState<SubjectType>([]);
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [totalPageCount, setTotalPageCount] = useState<number>(0);

	const [data, setData] = useState<SubjectType>([]);

	const [rowToDelete, setRowToDelete] = useState<SubjectObjectType | null>(
		null
	);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const fetchData = async (query: QueryType) => {
		setLoading(true);
		try {
			const response = await subjectApiRequest.subjects(query);
			const { data, message, pagination } = response.payload;
			const totalResults = pagination.totalResults;

			setData(Array.isArray(data) ? data : []);
			setTotalPageCount(pagination.totalResults);
		} catch (error) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	const handleRedirectToDetail = useCallback(
		(data: SubjectObjectType) =>
			router.push(`/dashboard/subjects/${data.subjectId}`),
		[]
	);

	const handleEdit = useCallback(
		(data: SubjectResType['data']) =>
			router.push(`/dashboard/subjects/${data.subjectId}/edit`),
		[]
	);

	const handleDelete = useCallback((data: SubjectObjectType) => {
		setRowToDelete(data);
		setIsDialogOpen(true);
	}, []);

	const confirmDelete = async () => {
		if (!rowToDelete) return;
		try {
			const response = await subjectApiRequest.delete(rowToDelete.subjectId);
			toast({
				description: response.payload.message,
			});

			// Update state
			setData((prev) =>
				prev.filter((item) => item.subjectId !== rowToDelete.subjectId)
			);
		} catch (error) {
			handleErrorApi({ error });
		} finally {
			setIsDialogOpen(false);
			setRowToDelete(null);
		}
	};

	const handleRefresh = useCallback(() => {
		fetchData({ pageNumber, pageSize });
	}, [pageNumber, pageSize]);

	useEffect(() => {
		if (loading) return;
		fetchData({ pageNumber, pageSize });
	}, [pageNumber, pageSize]);

	const columns = useMemo(
		() =>
			getSubjectsColumns({
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
			<SubjectAddButton />
			<SubjectUploadButton onSuccess={handleRefresh} />

			<BulkDeleteSubjectDialog
				selectedItems={selected.map((key) => key.subjectId)}
				onDeleted={handleRefresh}
			/>
			<DataTable
				columns={columns}
				data={data}
				pageNumber={pageNumber}
				pageSize={pageSize}
				totalCount={totalPageCount}
				onPageChange={setPageNumber}
				onPageSizeChange={setPageSize}
				onSelectedRowsChange={setSelected}
			/>
			<SubjectDeleteDialog
				isDialogOpen={isDialogOpen}
				setIsDialogOpen={(value) => setIsDialogOpen(value)}
				onConfirmDelete={confirmDelete}
			/>
		</>
	);
}
