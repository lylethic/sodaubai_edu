'use client';
import React, {
	Suspense,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
import DataTable from '@/app/(admin)/_components/data-table';
import { getSchoolColumns } from './columns';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { SchoolResType } from '@/schemaValidations/school.schema';
import { QueryType } from '@/types/queryType';
import schoolApiRequest from '@/apiRequests/school';
import { handleErrorApi } from '@/lib/utils';
import SchoolDeleteDialog from './school-delete-dialog';
import BulkDeleteSchoolDialog from './bulk-delete-dialog';
import SchoolUploadButton from './school-upload-button';
import StudentAddButton from './school-add-button';
import LoadingSpinner from '../../loading';

type SchoolType = SchoolResType['data'];

export default function SchoolsList() {
	const router = useRouter();
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState<SchoolType[]>([]);
	const [data, setData] = useState<SchoolType[]>([]);
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [totalPageCount, setTotalPageCount] = useState<number>(0);

	const [rowToDelete, setRowToDelete] = useState<SchoolType | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const fetchData = async (query: QueryType) => {
		if (loading) return;
		setLoading(true);
		setData([]);
		try {
			const response = await schoolApiRequest.getSchools(
				query.pageNumber,
				query.pageSize
			);
			const { data, pagination } = response.payload;

			setData(Array.isArray(data) ? data : []);
			setTotalPageCount(pagination.totalResults ?? 0);
		} catch (error) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	const confirmDelete = async () => {
		if (!rowToDelete) return;
		try {
			const response = await schoolApiRequest.deleteSchool(
				rowToDelete.schoolId
			);
			toast({
				description: response.payload.message,
			});

			// Update state
			setData((prev) =>
				prev.filter((item) => item.schoolId !== rowToDelete.schoolId)
			);
		} catch (error) {
			handleErrorApi({ error });
		} finally {
			setIsDialogOpen(false);
			setRowToDelete(null);
		}
	};

	const handleEdit = useCallback(
		(data: SchoolType) =>
			router.push(`/dashboard/schools/${data.schoolId}/edit`),
		[]
	);

	const handleDelete = useCallback((data: SchoolType) => {
		setRowToDelete(data);
		setIsDialogOpen(true);
	}, []);

	const handleRedirectToDetail = useCallback(
		(data: SchoolType) => router.push(`/dashboard/schools/${data.schoolId}`),
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
			getSchoolColumns({
				handleEdit,
				handleDelete,
				handleRedirectToDetail,
				pageNumber,
				pageSize,
			}),
		[handleEdit, handleDelete, handleRedirectToDetail, pageNumber, pageSize]
	);

	return (
		<Suspense fallback={<LoadingSpinner />}>
			<StudentAddButton />
			<SchoolUploadButton onSuccess={handleRefresh} />
			<BulkDeleteSchoolDialog
				selectedItems={selected.map((key) => key.schoolId)}
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
			<SchoolDeleteDialog
				isDialogOpen={isDialogOpen}
				setIsDialogOpen={(value) => setIsDialogOpen(value)}
				onConfirmDelete={confirmDelete}
			/>
		</Suspense>
	);
}
