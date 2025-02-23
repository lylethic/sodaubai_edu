'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { handleErrorApi } from '@/lib/utils';
import DataTable from '@/app/(admin)/_components/data-table';
import { QueryType } from '@/types/queryType';
import { getStudentsColumns } from './columns';
import { StudentResType } from '@/schemaValidations/student.schema';
import { studentApiRequest } from '@/apiRequests/student';
import FilterStudent from './student-filter-form';
import StudentAddButton from './student-add-button';
import StudentDeleteDialog from './student-delete-dialog';
import BulkDeleteStudentDialog from './student-bulk-delete-dialog';
import StudentUploadButton from './student-upload';

type StudentType = StudentResType['data'];

export default function StudentsList() {
	const router = useRouter();
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState<StudentType[]>([]);
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [totalPageCount, setTotalPageCount] = useState<number>(0);

	const [data, setData] = useState<StudentType[]>([]);

	const [rowToDelete, setRowToDelete] = useState<StudentType | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedSchoolId, setSelectedSchoolId] = useState<number | null>(0);

	const handleFilterChange = (schoolId: number | null) => {
		setSelectedSchoolId(schoolId ?? 0);
		setPageNumber(1);
	};

	const fetchData = async (query: QueryType) => {
		setLoading(true);
		setData([]);
		try {
			const { payload } = await studentApiRequest.students(
				query,
				selectedSchoolId
			);
			const { status, data, pagination } = payload;
			const totalResults = pagination?.totalResults;

			if ((!data && status === 404) || Array(data).length === 0) {
				setData([]);
				setTotalPageCount(0);
			} else {
				setData(Array.isArray(data) ? data : []);
				setTotalPageCount(totalResults ?? 0);
			}
		} catch (error) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = useCallback(
		(data: StudentType) =>
			router.push(`/dashboard/students/${data.studentId}/edit`),
		[]
	);

	const handleDelete = useCallback((data: StudentType) => {
		setRowToDelete(data);
		setIsDialogOpen(true);
	}, []);

	const confirmDelete = async () => {
		if (!rowToDelete) return;
		try {
			const response = await studentApiRequest.delete(rowToDelete.studentId);
			toast({
				description: response.payload.message,
			});

			// Update state
			setData((prev) =>
				prev.filter((item) => item.studentId !== rowToDelete.studentId)
			);
		} catch (error) {
			handleErrorApi({ error });
		} finally {
			setIsDialogOpen(false);
			setRowToDelete(null);
		}
	};

	const handleRedirectToDetail = useCallback(
		(data: StudentType) => router.push(`/dashboard/students/${data.studentId}`),
		[]
	);

	const handleRefresh = useCallback(() => {
		fetchData({ pageNumber, pageSize });
	}, [pageNumber, pageSize, selectedSchoolId]);

	const resetFilters = () => {
		setSelectedSchoolId(0);
	};

	useEffect(() => {
		if (loading) return;
		fetchData({ pageNumber, pageSize });
	}, [pageNumber, pageSize, selectedSchoolId]);

	const columns = useMemo(
		() =>
			getStudentsColumns({
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
			<StudentAddButton />
			<StudentUploadButton onSuccess={handleRefresh} />
			<FilterStudent
				schoolId={selectedSchoolId}
				onFilterChange={handleFilterChange}
				onReset={resetFilters}
			/>

			<BulkDeleteStudentDialog
				selectedItems={selected.map((key) => key.studentId)}
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
			<StudentDeleteDialog
				isDialogOpen={isDialogOpen}
				setIsDialogOpen={(value) => setIsDialogOpen(value)}
				onConfirmDelete={confirmDelete}
			/>
		</>
	);
}
