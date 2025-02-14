import React, { HTMLProps } from 'react';
import { DataTableRowThreeActions } from '@/app/(admin)/_components/data-table-row-three-action';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { PhanCongGiangDayResType } from '@/schemaValidations/phanCongGiangDayBia';

type PhanCongGiangDayType = PhanCongGiangDayResType['data'];

interface PhanCongGiangDayColumnProps {
	handleRedirectToDetail: (data: PhanCongGiangDayType) => void;
	handleEdit: (data: PhanCongGiangDayType) => void;
	handleDelete: (data: PhanCongGiangDayType) => void;
	pageNumber: number;
	pageSize: number;
}

export const getPhanCongGiangDayColumns = ({
	handleRedirectToDetail,
	handleDelete,
	handleEdit,
	pageNumber,
	pageSize,
}: PhanCongGiangDayColumnProps): ColumnDef<PhanCongGiangDayType>[] => [
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
		accessorKey: 'phanCongGiangDayId',
		header: 'Mã phân công giảng dạy',
	},
	{
		accessorKey: 'biaSoDauBaiId',
		header: 'Mã sổ đầu bài',
	},
	{
		accessorKey: 'classId',
		header: 'Mã lớp học',
	},
	{
		accessorKey: 'className',
		header: 'Tên lớp hiển thị',
	},
	{
		accessorKey: 'teacherId',
		header: 'Mã giáo viên',
	},
	{
		accessorKey: 'fullname',
		header: 'Giáo viên giảng dạy',
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
