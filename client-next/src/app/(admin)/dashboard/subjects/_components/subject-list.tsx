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

type SubjectObjectType = SubjectResType['data'];

interface SubjectsListProps {
	initialSubjects?: SubjectObjectType[];
	initialTotalCount?: number;
}

export default function SubjectsList({
	initialSubjects = [],
	initialTotalCount = 0,
}: SubjectsListProps) {
	const router = useRouter();
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState<SubjectObjectType[]>([]);
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [totalPageCount, setTotalPageCount] =
		useState<number>(initialTotalCount);
	const [data, setData] = useState<SubjectObjectType[]>(initialSubjects);
	const isFirstMount = React.useRef(true);

	const [rowToDelete, setRowToDelete] = useState<SubjectObjectType | null>(
		null
	);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const fetchData = async (query: QueryType) => {
		if (loading) return;
		setLoading(true);
		try {
			const response = await subjectApiRequest.subjects(query);
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

	const handleRedirectToDetail = useCallback(
		(data: SubjectObjectType) =>
			router.push(`/dashboard/subjects/${data.subjectId || data.id}`),
		[router]
	);

	const handleEdit = useCallback(
		(data: SubjectObjectType) =>
			router.push(`/dashboard/subjects/${data.subjectId || data.id}/edit`),
		[router]
	);

	const handleDelete = useCallback((data: SubjectObjectType) => {
		setRowToDelete(data);
		setIsDialogOpen(true);
	}, []);

	const confirmDelete = async () => {
		if (!rowToDelete) return;
		try {
			const idToDelete = rowToDelete.subjectId || rowToDelete.id || 0;
			const response = await subjectApiRequest.delete(idToDelete);
			toast({
				description: response.payload.message,
			});

			setData((prev) =>
				prev.filter(
					(item) =>
						(item.subjectId || item.id) !== idToDelete
				)
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
		if (isFirstMount.current) {
			isFirstMount.current = false;
			return;
		}
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
		[
			handleEdit,
			handleDelete,
			handleRedirectToDetail,
			pageNumber,
			pageSize,
		]
	);

	return (
		<>
			<SubjectAddButton />
			<SubjectUploadButton onSuccess={handleRefresh} />

			<BulkDeleteSubjectDialog
				selectedItems={selected.map(
					(key) => key.subjectId || key.id || 0
				)}
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
