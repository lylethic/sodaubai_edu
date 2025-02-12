'use client';

import { Button } from '@/components/ui/button';
import { TeacherResType } from '@/schemaValidations/teacher.schema';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { DataTableColumnHeader } from '@/app/(admin)/_components/data-table-column-header';
import React, { HTMLProps } from 'react';
import { DataTableRowThreeActions } from '@/app/(admin)/_components/data-table-row-three-action';

type TeacherType = TeacherResType['data'];

interface TeachersColumnProps {
	handleRedirectToDetail: (data: TeacherType) => void;
	handleEdit: (data: TeacherType) => void;
	handleDelete: (data: TeacherType) => void;
}

export const getTeacherscolumns = ({
	handleRedirectToDetail,
	handleEdit,
	handleDelete,
}: TeachersColumnProps): ColumnDef<TeacherType>[] => [
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
		accessorKey: 'teacherId',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Mã giáo viên
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
	},
	{
		accessorKey: 'accountId',
		header: 'Mã tài khoản',
	},
	{
		accessorKey: 'schoolId',
		header: 'Mã trường học',
	},
	{
		accessorKey: 'nameSchool',
		header: 'Tên trường học',
	},
	{
		accessorKey: 'schoolType',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Loại trường' />
		),
		filterFn: (row, id, value) => {
			return value.include(row.getValue(id));
		},
	},
	{
		accessorKey: 'fullname',
		header: 'Họ và tên',
	},
	{
		accessorKey: 'dateOfBirth',
		header: 'Ngày sinh',
	},
	{
		accessorKey: 'gender',
		header: 'Giới tính',
	},
	{
		accessorKey: 'address',
		header: 'Địa chỉ',
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
		accessorKey: 'dateCreate',
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
