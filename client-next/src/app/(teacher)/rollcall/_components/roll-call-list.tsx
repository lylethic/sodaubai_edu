'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { formatDateToDDMMYYYY, handleErrorApi } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/app/app-provider';
import { QueryType } from '@/types/queryType';
import {
	RollCallDetailResType,
	RollCallResType,
} from '@/schemaValidations/rollcall-schema';
import { rollcallApiRequest } from '@/apiRequests/rollcall';
import FilterRollCall from './filter-rollcall';
import RollCallAddButton from './roll-call-add-button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import RollCallDeleteDialog from './rollcall-delete-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { PaginationWithLinks } from '@/components/pagination-with-links';

type RollCallType = RollCallResType['data'];

interface FilterProps {
	filters?: {
		weekId: number | null;
		classId: number | null;
	};
}
export default function RollCallList({ filters }: FilterProps) {
	const router = useRouter();
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [totalPageCount, setTotalPageCount] = useState<number>(0);
	const [selected, setSelected] = useState<number[]>([]);

	const [rollCalls, setRollCalls] = useState<RollCallType[]>([]);
	const [rollCallDetails, setRollCallDetails] = useState<
		RollCallDetailResType['data'][]
	>([]);
	const [selectedWeek, setSelectedWeek] = useState<number>(0);
	const [selectedClass, setSelectedClass] = useState<number>(0);
	const [selectedSchool, setSelectedSchool] = useState<number>(0);

	const [rowToDelete, setRowToDelete] = useState<RollCallType | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const { user } = useAppContext();
	const schoolId = user?.schoolId ?? 0;

	// Filter Props
	const handleFilterChange = (updatedFilters: FilterProps['filters']) => {
		setSelectedWeek(updatedFilters?.weekId ?? 0);
		setSelectedClass(updatedFilters?.classId ?? 0);
	};

	const fetchRollCalls = async (query: QueryType) => {
		setLoading(true);
		try {
			const { payload } = await rollcallApiRequest.rollCalls(
				query,
				selectedWeek,
				selectedClass
			);
			const result = Array.isArray(payload.data) ? payload.data : [];
			const totalResults = payload.pagination?.totalResults;
			setRollCalls(result);
			setTotalPageCount(totalResults ?? 0);
		} catch (error) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = useCallback(
		(data: RollCallType) => router.push(`/rollcall/${data.rollCallId}/edit`),
		[]
	);

	const handleRedirectToDetail = useCallback(
		(data: RollCallType) => router.push(`/rollcall/${data.rollCallId}`),
		[]
	);

	const handleDelete = (id: number) => {
		setRollCalls((prev) => prev.filter((data) => data.rollCallId !== id));
	};

	const confirmDelete = async () => {
		if (!rowToDelete) return;
		try {
			const { payload } = await rollcallApiRequest.delete(
				rowToDelete.rollCallId
			);
			toast({
				description: payload.message,
			});

			// Update state
			setRollCalls((prev) =>
				prev.filter((item) => item.rollCallId !== rowToDelete.rollCallId)
			);
		} catch (error) {
			handleErrorApi({ error });
		} finally {
			setIsDialogOpen(false);
			setRowToDelete(null);
		}
	};

	// select all
	const handleSelectAll = () => {
		if (selected.length === rollCalls.length) {
			setSelected([]); // Deselect all
		} else {
			setSelected(rollCalls.map((rollCallId) => rollCallId.rollCallId)); // Select all
		}
	};
	const handleCheckboxChange = (id: number) => {
		setSelected((prev) =>
			prev.includes(id)
				? prev.filter((rollCallId) => rollCallId !== id)
				: [...prev, id]
		);
	};
	// const columns = useMemo(
	// 	() =>
	// 		getRollCallsColumns({
	// 			handleEdit,
	// 			handleDelete,
	// 			handleRedirectToDetail,
	// 			pageNumber,
	// 			pageSize,
	// 		}),
	// 	[handleEdit, handleDelete, handleRedirectToDetail, pageNumber, pageSize]
	// );

	useEffect(() => {
		if (loading) return;
		fetchRollCalls({ pageNumber, pageSize });
	}, [selectedWeek, selectedClass, pageNumber, pageSize]);

	return (
		<div>
			<RollCallAddButton />
			<FilterRollCall
				schoolId={schoolId}
				initialFilters={filters}
				onFilterChange={handleFilterChange}
			/>
			<Table className='border p-2'>
				<TableHeader>
					<TableRow>
						<TableHead scope='col' className='ps-4 py-3'>
							<Checkbox
								onCheckedChange={handleSelectAll}
								checked={selected.length === rollCalls.length}
							/>
						</TableHead>
						<TableHead>Thứ</TableHead>
						<TableHead>Ngày học</TableHead>
						<TableHead>Sĩ số</TableHead>
						<TableHead>Vắng</TableHead>
						<TableHead>Chức năng</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{rollCalls.map((key, index) => (
						<TableRow key={key.rollCallId + index}>
							<TableCell>
								<div className='flex items-center'>
									<Input
										id='checkbox-table-search-1'
										type='checkbox'
										className='w-4 h-4 ms-2'
										onChange={() => handleCheckboxChange(key.rollCallId)}
										checked={selected.includes(key.rollCallId)}
									/>
									<Label htmlFor='checkbox-table-search-1' className='sr-only'>
										checkbox
									</Label>
								</div>
							</TableCell>
							<TableCell className='border-r'>{key.dayOfTheWeek}</TableCell>
							<TableCell className='border-r'>
								{key.dateAt ? formatDateToDDMMYYYY(key.dateAt) : ''}
							</TableCell>
							<TableCell className='border-r'>
								{key.numberOfAttendants}
							</TableCell>
							<TableCell className='border-r'>
								{(key.rollCallDetails?.length ?? 0) > 0 ? (
									<Table className='border mt-2'>
										<TableHeader className='border-b'>
											<TableRow className='bg-gray-200'>
												<TableHead>Mã học sinh</TableHead>
												<TableHead>Họ và tên học sinh</TableHead>
												<TableHead>Có phép</TableHead>
												<TableHead>Lý do</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{key.rollCallDetails?.map((detail) => (
												<TableRow key={detail.absenceId}>
													<TableCell>{detail.studentId}</TableCell>
													<TableCell>{detail.student.fullname}</TableCell>
													<TableCell>
														{detail.isExcused ? 'Có phép' : 'Không phép'}
													</TableCell>
													<TableCell>{detail.description}</TableCell>
												</TableRow>
											)) ?? []}
										</TableBody>
									</Table>
								) : (
									'Không vắng'
								)}
							</TableCell>
							<TableCell>
								<RollCallDeleteDialog data={key} onDelete={handleDelete} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<PaginationWithLinks
				page={pageNumber}
				pageSize={pageSize}
				totalCount={totalPageCount}
				onPageChange={(newPage) => setPageNumber(newPage)}
				onPageSizeChange={(newSize) => setPageSize(newSize)}
				pageSizeSelectOptions={{ pageSizeOptions: [5, 10, 20, 50] }}
			/>
		</div>
	);
}
