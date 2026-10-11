'use client';
import React, {
	Suspense,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import DataTable from '@/app/(admin)/_components/data-table';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { QueryType } from '@/types/queryType';
import { handleErrorApi } from '@/lib/utils';
import LoadingSpinner from '../../loading';
import { ClassificationResType } from '@/schemaValidations/xepLoaiTietHoc.schema';
import { xepLoaiApiRequest } from '@/apiRequests/xeploaiTiethoc';
import { getClassifyColumns } from './columns';
import ClassifyDeleteDialog from './classify-delete-dialog';
import ClassifyAddButton from './classify-add-button';
import BulkDeleteClassifyDialog from './bulk-delete-dialog';
import ClassifyUploadButton from './xeploai-upload';

type ClassifyType = ClassificationResType['data'];

interface XepLoaiTietHocListProps {
	initialClassifications?: ClassifyType[];
	initialTotalCount?: number;
}

export default function XepLoaiTietHocList({
	initialClassifications = [],
	initialTotalCount = 0,
}: XepLoaiTietHocListProps) {
	const router = useRouter();
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState<ClassifyType[]>([]);
	const [data, setData] = useState<ClassifyType[]>(initialClassifications);
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [totalPageCount, setTotalPageCount] =
		useState<number>(initialTotalCount);
	const isFirstMount = useRef(true);

	const [rowToDelete, setRowToDelete] = useState<ClassifyType | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const fetchData = async (query: QueryType) => {
		if (loading) return;
		setLoading(true);
		try {
			const response = await xepLoaiApiRequest.xeploais(query);
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

	const confirmDelete = async () => {
		if (!rowToDelete) return;
		try {
			const idToDelete =
				rowToDelete.classificationId || rowToDelete.id || 0;
			const response = await xepLoaiApiRequest.delete(idToDelete);
			toast({
				description: response.payload.message,
			});

			// Update state
			setData((prev) =>
				prev.filter(
					(item) =>
						(item.classificationId || item.id) !== idToDelete
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
			router.push(
				`/dashboard/xep-loai-tiet-hoc/${data.classificationId || data.id}/edit`
			),
		[router]
	);

	const handleDelete = useCallback((data: ClassifyType) => {
		setRowToDelete(data);
		setIsDialogOpen(true);
	}, []);

	const handleRedirectToDetail = useCallback(
		(data: ClassifyType) =>
			router.push(
				`/dashboard/xep-loai-tiet-hoc/${data.classificationId || data.id}`
			),
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
				selectedItems={selected.map(
					(key) => key.classificationId || key.id || 0
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
			<ClassifyDeleteDialog
				isDialogOpen={isDialogOpen}
				setIsDialogOpen={(value) => setIsDialogOpen(value)}
				onConfirmDelete={confirmDelete}
			/>
		</Suspense>
	);
}
