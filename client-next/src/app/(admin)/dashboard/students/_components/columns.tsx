import React, { HTMLProps } from 'react';
import { DataTableRowThreeActions } from '@/app/(admin)/_components/data-table-row-three-action';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { StudentResType } from '@/schemaValidations/student.schema';
import { formatDateToDDMMYYYY } from '@/lib/utils';

type StudentType = StudentResType['data'];

interface StudentColumnProps {
	handleRedirectToDetail: (data: StudentType) => void;
	handleEdit: (data: StudentType) => void;
	handleDelete: (data: StudentType) => void;
	pageNumber: number;
	pageSize: number;
}

export const getStudentsColumns = ({
	handleRedirectToDetail,
	handleEdit,
	handleDelete,
	pageNumber,
	pageSize,
}: StudentColumnProps): ColumnDef<StudentType>[] => [
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
		accessorKey: 'studentId',
		header: 'Mã học sinh',
	},
	{
		accessorKey: 'schoolId',
		header: 'Mã trường học',
	},
	{
		accessorKey: 'accountId',
		header: 'Mã tài khoản',
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
		accessorKey: 'className',
		header: 'Lớp học',
	},
	{
		accessorKey: 'schoolName',
		header: 'Tên trường học',
	},
	{
		accessorKey: 'email',
		header: 'Email',
	},
	{
		accessorKey: 'fullname',
		header: 'Họ và tên',
	},
	{
		accessorKey: 'address',
		header: 'Địa chỉ',
	},
	{
		accessorKey: 'dateOfBirth',
		header: 'Ngày sinh',
		cell: ({ row }) => (
			<span>
				{row.original.dateOfBirth
					? formatDateToDDMMYYYY(row.original.dateOfBirth)
					: null}
			</span>
		),
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
