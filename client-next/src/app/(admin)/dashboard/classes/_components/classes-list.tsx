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

export default function ClassesList() {
	const router = useRouter();
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState<LopHocType[]>([]);
	const [selectedSchoolId, setSelectedSchoolId] = useState<number | null>(0);

	const [lopHocs, setLopHocs] = useState<LopHocType[]>([]);
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [totalPageCount, setTotalPageCount] = useState<number>(0);

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [rowToDelete, setRowToDelete] = useState<LopHocType | null>(null);

	const fetchData = async (query: QueryType) => {
		setLoading(true);
		try {
			const response = selectedSchoolId
				? await lopHocApiRequest.getLopHocBySchool(query, selectedSchoolId)
				: await lopHocApiRequest.classes(query);

			const { data, pagination } = response.payload;
			const totalResults = pagination?.totalResults;

			setLopHocs(Array.isArray(data) ? data : []);
			setTotalPageCount(totalResults ?? 0);
		} catch (error) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = useCallback(
		(data: LopHocType) =>
			router.push(`/dashboard/classes/${data.classId}/edit`),
		[]
	);

	const handleDelete = useCallback((data: LopHocType) => {
		setRowToDelete(data);
		setIsDialogOpen(true);
	}, []);

	const confirmDelete = async () => {
		if (!rowToDelete) return;
		try {
			const response = await lopHocApiRequest.delete(rowToDelete.classId);
			toast({
				description: response.payload.message,
			});

			// Update state lopHocs
			setLopHocs((prev) =>
				prev.filter((item) => item.classId !== rowToDelete.classId)
			);
		} catch (error) {
			handleErrorApi({ error });
		} finally {
			setIsDialogOpen(false);
			setRowToDelete(null);
		}
	};

	const handleRedirectToDetail = useCallback(
		(data: LopHocType) => router.push(`/dashboard/classes/${data.classId}`),
		[]
	);

	const handleRefresh = useCallback(() => {
		fetchData({ pageNumber, pageSize });
	}, [pageNumber, pageSize]);

	const handleFilterChange = (schoolId: number | null) => {
		setSelectedSchoolId(schoolId ?? 0);
		setPageNumber(1);
	};

	const resetFilters = () => {
		setSelectedSchoolId(0);
	};

	useEffect(() => {
		if (loading) return;
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
		[handleEdit, handleDelete, handleRedirectToDetail, pageNumber, pageSize]
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
				selectedItems={selected.map((key) => key.classId)}
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
