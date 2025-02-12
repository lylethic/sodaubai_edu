import React, { HTMLProps } from 'react';
import { DataTableRowThreeActions } from '@/app/(admin)/_components/data-table-row-three-action';
import { ColumnDef } from '@tanstack/react-table';
import { SchoolResType } from '@/schemaValidations/school.schema';

type SchoolType = SchoolResType['data'];

interface SchoolColumnProps {
	handleRedirectToDetail: (data: SchoolType) => void;
	handleEdit: (data: SchoolType) => void;
	handleDelete: (data: SchoolType) => void;
	pageNumber: number;
	pageSize: number;
}

export const getSchoolColumns = ({
	handleRedirectToDetail,
	handleEdit,
	handleDelete,
	pageNumber,
	pageSize,
}: SchoolColumnProps): ColumnDef<SchoolType>[] => [
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
		accessorKey: 'schoolId',
		header: 'Mã trường học',
	},
	{
		accessorKey: 'provinceId',
		header: 'Mã tỉnh',
	},
	{
		accessorKey: 'districtId',
		header: 'Mã huyện',
	},
	{
		accessorKey: 'nameSchool',
		header: 'Tên trường học',
	},
	{
		accessorKey: 'address',
		header: 'Địa chỉ trường học',
	},
	{
		accessorKey: 'phoneNumber',
		header: 'Số điện thoại trường học',
	},
	{
		accessorKey: 'schoolType',
		header: 'Phân loại trường học',
	},
	{
		accessorKey: 'description',
		header: 'Ghi chú',
		cell: ({ row }) => (
			<span>
				{row.original.description !== 'null' ? row.original.description : '_'}
			</span>
		),
	},
	{
		accessorKey: 'dateCreated',
		header: 'Ngày tạo',
		cell: ({ row }) => (
			<span>
				{row.original.dateCreated
					? new Date(row.original.dateCreated).toLocaleDateString('vi-VN')
					: '_'}
			</span>
		),
	},
	{
		accessorKey: 'dateUpdated',
		header: 'Ngày cập nhật',
		cell: ({ row }) => (
			<span>
				{row.original.dateUpdated
					? new Date(row.original.dateUpdated).toLocaleDateString('vi-VN')
					: '_'}
			</span>
		),
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
