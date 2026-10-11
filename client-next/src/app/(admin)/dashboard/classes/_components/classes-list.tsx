'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { handleErrorApi } from '@/lib/utils';
import { lopHocApiRequest } from '@/apiRequests/lopHoc';
import DataTable from '@/app/(admin)/_components/data-table';
import { LopHocResType } from '@/schemaValidations/lopHoc.shema';
import { QueryType } from '@/types/queryType';
import { getLopHocColumns } from './columns';
import ClassAddButton from './class-add-button';
import BulkDeleteClasses from './bulk-delete';
import FilterLopHoc from './filter-lop-hoc';
import DeleteClassDialog from './delete-class-dialog';
import ClassesUploadButton from './classes-upload-button';

type LopHocType = LopHocResType['data'];

interface ClassesListProps {
	initialClasses?: LopHocType[];
	initialTotalCount?: number;
}

export default function ClassesList({
	initialClasses = [],
	initialTotalCount = 0,
}: ClassesListProps) {
	const router = useRouter();
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState<LopHocType[]>([]);
	const [selectedSchoolId, setSelectedSchoolId] = useState<number | null>(0);

	const [lopHocs, setLopHocs] = useState<LopHocType[]>(initialClasses);
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [totalPageCount, setTotalPageCount] =
		useState<number>(initialTotalCount);
	const isFirstMount = React.useRef(true);

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [rowToDelete, setRowToDelete] = useState<LopHocType | null>(null);

	const fetchData = async (query: QueryType) => {
		if (loading) return;
		setLoading(true);
		try {
			const response = selectedSchoolId
				? await lopHocApiRequest.getLopHocBySchool(query, selectedSchoolId)
				: await lopHocApiRequest.classes(query);

			const payload = response.payload as any;
			const items =
				payload?.data?.items ||
				(Array.isArray(payload?.data) ? payload.data : []);
			const totalResults =
				payload?.data?.totalCount ??
				payload?.pagination?.totalResults ??
				0;

			setLopHocs(items);
			setTotalPageCount(totalResults);
		} catch (error) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = useCallback(
		(data: LopHocType) =>
			router.push(`/dashboard/classes/${data.classId || data.id}/edit`),
		[router]
	);

	const handleDelete = useCallback((data: LopHocType) => {
		setRowToDelete(data);
		setIsDialogOpen(true);
	}, []);

	const confirmDelete = async () => {
		if (!rowToDelete) return;
		try {
			const idToDelete = rowToDelete.classId || rowToDelete.id || 0;
			const response = await lopHocApiRequest.delete(idToDelete);
			toast({
				description: response.payload.message,
			});

			setLopHocs((prev) =>
				prev.filter(
					(item) =>
						(item.classId || item.id) !== idToDelete
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
		(data: LopHocType) =>
			router.push(`/dashboard/classes/${data.classId || data.id}`),
		[router]
	);

	const handleRefresh = useCallback(() => {
		fetchData({ pageNumber, pageSize });
	}, [pageNumber, pageSize, selectedSchoolId]);

	const handleFilterChange = (schoolId: number | null) => {
		setSelectedSchoolId(schoolId ?? 0);
		setPageNumber(1);
	};

	const resetFilters = () => {
		setSelectedSchoolId(0);
	};

	useEffect(() => {
		if (isFirstMount.current) {
			isFirstMount.current = false;
			return;
		}
		fetchData({ pageNumber, pageSize });
	}, [pageNumber, pageSize, selectedSchoolId]);

	const columns = useMemo(
		() =>
			getLopHocColumns({
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
			<ClassAddButton onSuccess={handleRefresh} />
			<ClassesUploadButton />
			<FilterLopHoc
				schoolId={selectedSchoolId}
				onFilterChange={handleFilterChange}
				onReset={resetFilters}
			/>

			<BulkDeleteClasses
				selectedItems={selected.map(
					(key) => key.classId || key.id || 0
				)}
				onDeleted={handleRefresh}
			/>
			<DataTable
				columns={columns}
				data={lopHocs}
				pageNumber={pageNumber}
				pageSize={pageSize}
				totalCount={totalPageCount}
				onPageChange={setPageNumber}
				onPageSizeChange={setPageSize}
				onSelectedRowsChange={setSelected}
			/>
			<DeleteClassDialog
				isDialogOpen={isDialogOpen}
				setIsDialogOpen={setIsDialogOpen}
				onConfirmDelete={confirmDelete}
			/>
		</>
	);
}
