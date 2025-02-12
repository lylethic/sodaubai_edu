import React, { HTMLProps } from 'react';
import { DataTableRowThreeActions } from '@/app/(admin)/_components/data-table-row-three-action';
import { PhanCongChuNhiemResType } from '@/schemaValidations/phanCongChuNhiemLop.schema';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';

type PhanCongChuNhiemType = PhanCongChuNhiemResType['data'];

interface PhanCongChuNhiemColumnProps {
	handleRedirectToDetail: (data: PhanCongChuNhiemType) => void;
	handleEdit: (data: PhanCongChuNhiemType) => void;
	handleDelete: (data: PhanCongChuNhiemType) => void;
	pageNumber: number;
	pageSize: number;
}
export const getPhanCongChuNhiemColumns = ({
	handleRedirectToDetail,
	handleDelete,
	handleEdit,
	pageNumber,
	pageSize,
}: PhanCongChuNhiemColumnProps): ColumnDef<PhanCongChuNhiemType>[] => [
	{
		id: 'select',
		header: ({ table }) => (
			<IndeterminateCheckbox
				{...{
					checked: table.getIsAllRowsSelected(),
					indeterminate: table.getIsSomeRowsSelected(),
					onChange: table.getToggleAllRowsSelectedHandler(),
				}}
			/>
		),
		cell: ({ row }) => (
			<div className='px-1'>
				<IndeterminateCheckbox
					{...{
						checked: row.getIsSelected(),
						disabled: !row.getCanSelect(),
						indeterminate: row.getIsSomeSelected(),
						onChange: row.getToggleSelectedHandler(),
					}}
				/>
			</div>
		),
	},
	{
		accessorKey: 'Stt',
		header: 'STT',
		cell: ({ row }) => {
			const rowIndex = row.index;
			const serialNumber = rowIndex + 1 + (pageNumber - 1) * pageSize;
			return <span>{serialNumber}</span>;
		},
	},
	{
		accessorKey: 'phanCongChuNhiemId',
		header: 'Mã phân công chủ nhiệm',
	},
	{
		accessorKey: 'schoolId',
		header: 'Mã trường học',
	},
	{
		accessorKey: 'schoolName',
		header: 'Trường học',
	},
	{
		accessorKey: 'teacherId',
		header: 'Mã giáo viên',
	},
	{
		accessorKey: 'teacherName',
		header: 'Giáo viên',
	},
	{
		accessorKey: 'gradeId',
		header: 'Mã khối lớp',
	},
	{
		accessorKey: 'classId',
		header: 'Mã lớp học',
	},
	{
		accessorKey: 'nameClass',
		header: 'Lớp học',
	},
	{
		accessorKey: 'academicYearId',
		header: 'Mã năm học',
	},
	{
		accessorKey: 'academicYearName',
		header: 'Năm học',
	},
	{
		accessorKey: 'description',
		header: 'Ghi chú',
	},
	{
		accessorKey: 'status',
		header: 'Trạng thái',
		cell: ({ row }) => (
			<span>
				{row.original.status ? (
					<Button type='button' variant={'ghost'}>
						<div className='bg-green-600 h-4 w-4 outline-none rounded-[50%]'></div>
						Hoạt động
					</Button>
				) : (
					<Button type='button' variant={'ghost'}>
						<div className='bg-red-600 h-4 w-4 outline-none rounded-[50%]'></div>
						Ngưng hoạt động
					</Button>
				)}
			</span>
		),
	},
	{
		accessorKey: 'dateCreated',
		header: 'Ngày tạo',
		cell: ({ row }) => {
			const date = row.original.dateCreated
				? new Date(row.original.dateCreated)
				: null;
			return date ? date.toLocaleDateString('vi-VN') : '_';
		},
	},
	{
		accessorKey: 'dateUpdated',
		header: 'Ngày cập nhật',
		cell: ({ row }) => {
			const date = row.original.dateUpdated
				? new Date(row.original.dateUpdated)
				: null;
			return date ? date.toLocaleDateString('vi-VN') : '_';
		},
	},
	{
		id: 'action',
		header: 'Chức năng',
		cell: ({ row }) => (
			<DataTableRowThreeActions
				row={row}
				onDetail={handleRedirectToDetail}
				onEdit={handleEdit}
				onDelete={handleDelete}
			/>
		),
	},
];
export function IndeterminateCheckbox({
	indeterminate,
	className = '',
	...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
	const ref = React.useRef<HTMLInputElement>(null!);

	React.useEffect(() => {
		if (typeof indeterminate === 'boolean') {
			ref.current.indeterminate = !rest.checked && indeterminate;
		}
	}, [ref, indeterminate]);

	return (
		<input
			type='checkbox'
			ref={ref}
			className={className + ' cursor-pointer'}
			{...rest}
		/>
	);
}
