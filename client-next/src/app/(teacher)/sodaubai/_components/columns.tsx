'use client';

import React, { HTMLProps } from 'react';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { BiaSoDauBaiResType } from '@/schemaValidations/biaSoDauBai.schema';
import { DataTableRowTeacherActions } from '@/app/(admin)/_components/data-row-action-teacher';

type BiaSoDauBaiType = BiaSoDauBaiResType['data'];

interface BiaSoDauBaiColumnProps {
	handleRedirectToDetail: (data: BiaSoDauBaiType) => void;
	handleRedirectToChiTietSoDauBai: (data: BiaSoDauBaiType) => void;
}

export const getBiaSoDauBaisColumns = ({
	handleRedirectToDetail,
	handleRedirectToChiTietSoDauBai,
}: BiaSoDauBaiColumnProps): ColumnDef<BiaSoDauBaiType>[] => [
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
		accessorKey: 'biaSoDauBaiId',
		header: 'Mã bìa sổ đầu bài',
	},
	{
		accessorKey: 'schoolName',
		header: 'Trường học',
	},
	{
		accessorKey: 'nienKhoaName',
		header: 'Năm học',
	},
	{
		accessorKey: 'className',
		header: 'Lớp học',
	},
	{
		accessorKey: 'tenGiaoVienChuNhiem',
		header: 'Giáo viên chủ nhiệm',
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
	},
	{
		accessorKey: 'dateUpdated',
		header: 'Ngày cập nhật',
	},
	{
		id: 'action',
		header: 'Chức năng',
		cell: ({ row }) => (
			<DataTableRowTeacherActions
				row={row}
				onDetail={handleRedirectToDetail}
				onRedirectToChiTietSoDauBai={handleRedirectToChiTietSoDauBai}
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
