'use client';
import React, {
	Suspense,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
import DataTable from '@/app/(admin)/_components/data-table';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { SchoolResType } from '@/schemaValidations/school.schema';
import { QueryType } from '@/types/queryType';
import schoolApiRequest from '@/apiRequests/school';
import { handleErrorApi } from '@/lib/utils';
import LoadingSpinner from '../../loading';
import { ClassifyResType } from '@/schemaValidations/xepLoaiTietHoc.schema';
import { xepLoaiApiRequest } from '@/apiRequests/xeploaiTiethoc';
import { getClassifyColumns } from './columns';
import ClassifyDeleteDialog from './classify-delete-dialog';
import ClassifyAddButton from './classify-add-button';
import BulkDeleteClassifyDialog from './bulk-delete-dialog';
import ClassifyUploadButton from './xeploai-upload';

type ClassifyType = ClassifyResType['data'];

export default function XepLoaiTietHocList() {
	const router = useRouter();
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState<ClassifyType[]>([]);
	const [data, setData] = useState<ClassifyType[]>([]);
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [totalPageCount, setTotalPageCount] = useState<number>(0);

	const [rowToDelete, setRowToDelete] = useState<ClassifyType | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const fetchData = async (query: QueryType) => {
		if (loading) return;
		setLoading(true);
		setData([]);
		try {
			const response = await xepLoaiApiRequest.xeploais(query);
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
			const response = await xepLoaiApiRequest.delete(
				rowToDelete.classificationId
			);
			toast({
				description: response.payload.message,
			});

			// Update state
			setData((prev) =>
				prev.filter(
					(item) => item.classificationId !== rowToDelete.classificationId
				)
			);
		} catch (error) {
			handleErrorApi({ error });
		} finally {
			setIsDialogOpen(false);
			setRowToDelete(null);
		}
	};

	const handleEdit = useCallback(
		(data: ClassifyType) =>
			router.push(`/dashboard/xep-loai-tiet-hoc/${data.classificationId}/edit`),
		[]
	);

	const handleDelete = useCallback((data: ClassifyType) => {
		setRowToDelete(data);
		setIsDialogOpen(true);
	}, []);

	const handleRedirectToDetail = useCallback(
		(data: ClassifyType) =>
			router.push(`/dashboard/xep-loai-tiet-hoc/${data.classificationId}`),
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
			getClassifyColumns({
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
			<ClassifyAddButton />
			<ClassifyUploadButton onSuccess={handleRefresh} />
			<BulkDeleteClassifyDialog
				selectedItems={selected.map((key) => key.classificationId)}
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
			<ClassifyDeleteDialog
				isDialogOpen={isDialogOpen}
				setIsDialogOpen={(value) => setIsDialogOpen(value)}
				onConfirmDelete={confirmDelete}
			/>
		</Suspense>
	);
}
