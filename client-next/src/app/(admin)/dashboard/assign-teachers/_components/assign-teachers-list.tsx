'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { handleErrorApi } from '@/lib/utils';
import DataTable from '@/app/(admin)/_components/data-table';
import {
	PhanCongChuNhiemListResType,
	PhanCongChuNhiemResType,
} from '@/schemaValidations/phanCongChuNhiemLop.schema';
import { phanCongChuNhiemApiRequest } from '@/apiRequests/phanCongChuNhiem';
import { QueryType } from '@/types/queryType';
import { getPhanCongChuNhiemColumns } from './columns';
import AssignTeacherAddButton from './add-assign-teacher-button';
import DeleteAssignTeacher from './delete-assign-teacher';
import FilterAssignTeachers from './filter-assign-teachers';
import BulkDeleteAssignTeachersButton from './bulk-delete';

type PhanCongListType = PhanCongChuNhiemListResType['data'];
type PhanCongType = PhanCongChuNhiemResType['data'];

interface FilterProps {
	filters?: {
		schoolId: number | null;
		gradeId: number | null;
		classId: number | null;
	};
}

export default function AssignTeachersList({ filters }: FilterProps) {
	const [phanCongChuNhiems, setPhanCongChuNhiem] = useState<PhanCongListType>(
		[]
	);
	const router = useRouter();
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [rowToDelete, setRowToDelete] = useState<PhanCongType | null>(null);

	// This is use for delete 1.
	const [selected, setSelected] = useState<PhanCongListType>([]);

	// filter params
	const [selectedSchoolId, setSelectedSchoolId] = useState<number>(0);
	const [selectedGradeId, setSelectedGradeId] = useState<number | null>(0);
	const [selectedClassId, setSelectedClassId] = useState<number | null>(0);

	const [pageNumber, setPageNumber] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [totalPageCount, setTotalPageCount] = useState<number>(0);

	const handleFilterChange = (key: FilterProps['filters']) => {
		setSelectedSchoolId(key?.schoolId ?? 0);
		setSelectedGradeId(key?.gradeId ?? 0);
		setSelectedClassId(key?.classId ?? 0);
		setPageNumber(1);
	};

	const fetchData = async (query: QueryType) => {
		if (loading) return;
		setLoading(true);
		setPhanCongChuNhiem([]);
		try {
			if (!selectedSchoolId) {
				toast({
					title: 'Thông báo',
					variant: 'default',
					description: 'Vui lòng chọn ít nhất thông tin trường học',
					className: 'bg-yellow-400',
				});
			}
			const response = await phanCongChuNhiemApiRequest.phanCongs(
				query.pageNumber,
				query.pageSize,
				selectedSchoolId || 0,
				selectedGradeId !== 0 ? selectedGradeId : null,
				selectedClassId !== 0 ? selectedClassId : null
			);

			const data = response.payload.data;
			const totalResults = response.payload.pagination?.totalResults;

			setTotalPageCount(totalResults ? totalResults : 0);
			setPhanCongChuNhiem(Array.isArray(data) ? data : []);
		} catch (error: any) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = useCallback(
		(data: PhanCongType) =>
			router.push(`/dashboard/assign-teachers/${data.phanCongChuNhiemId}/edit`),
		[]
	);

	const handleDelete = useCallback((data: PhanCongType) => {
		setRowToDelete(data);
		setIsDialogOpen(true);
	}, []);

	const confirmDelete = async () => {
		if (!rowToDelete) return;
		try {
			const response = await phanCongChuNhiemApiRequest.delete(
				rowToDelete.phanCongChuNhiemId
			);
			toast({
				description: response.payload.message,
			});

			// Update state lopHocs
			setPhanCongChuNhiem((prev) =>
				prev.filter(
					(item) => item.phanCongChuNhiemId !== rowToDelete.phanCongChuNhiemId
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
		(data: PhanCongType) =>
			router.push(`/dashboard/assign-teachers/${data.phanCongChuNhiemId}`),
		[]
	);

	const handleRefresh = useCallback(() => {
		fetchData({ pageNumber, pageSize });
	}, [pageNumber, pageSize]);

	useEffect(() => {
		fetchData({ pageNumber, pageSize });
		console.log(phanCongChuNhiems);
	}, [
		pageNumber,
		pageSize,
		selectedSchoolId,
		selectedGradeId,
		selectedClassId,
	]);

	const columns = useMemo(
		() =>
			getPhanCongChuNhiemColumns({
				handleEdit,
				handleDelete,
				handleRedirectToDetail,
				pageNumber,
				pageSize,
			}),
		[]
	);

	return (
		<div>
			<AssignTeacherAddButton onSuccess={handleRefresh} />
			<FilterAssignTeachers
				initialFilters={filters}
				onFilterChange={handleFilterChange}
			/>
			<BulkDeleteAssignTeachersButton
				selectedItems={selected.map((key) => key.phanCongChuNhiemId)}
				onDeleted={handleRefresh}
			/>
			<DataTable
				columns={columns}
				data={phanCongChuNhiems}
				pageNumber={pageNumber}
				pageSize={pageSize}
				totalCount={totalPageCount}
				onPageChange={setPageNumber}
				onPageSizeChange={setPageSize}
				onSelectedRowsChange={setSelected}
			/>

			<DeleteAssignTeacher
				isDialogOpen={isDialogOpen}
				setIsDialogOpen={(value) => setIsDialogOpen(value)}
				onConfirmDelete={confirmDelete}
			/>
		</div>
	);
}
