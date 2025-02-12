import React, { HTMLProps } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { LopHocResType } from '@/schemaValidations/lopHoc.shema';
import { DataTableRowThreeActions } from '@/app/(admin)/_components/data-table-row-three-action';
import { Button } from '@/components/ui/button';

type LopHocType = LopHocResType['data'];

interface LopHocColumnProps {
	handleRedirectToDetail: (data: LopHocType) => void;
	handleEdit: (data: LopHocType) => void;
	handleDelete: (data: LopHocType) => void;
	pageNumber: number;
	pageSize: number;
}

export const getLopHocColumns = ({
	handleRedirectToDetail,
	handleEdit,
	handleDelete,
	pageNumber,
	pageSize,
}: LopHocColumnProps): ColumnDef<LopHocType>[] => [
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
		accessorKey: 'classId',
		header: 'Mã lớp học',
	},
	{
		accessorKey: 'schoolName',
		header: 'Trường học',
	},
	{
		accessorKey: 'gradeName',
		header: 'Khối lớp',
	},
	{
		accessorKey: 'teacherName',
		header: 'Giáo viên chủ nhiệm',
	},
	{
		accessorKey: 'nienKhoa',
		header: 'Năm học',
	},
	{
		accessorKey: 'className',
		header: 'Lớp học',
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
