import React, { HTMLProps } from 'react';
import { DataTableRowThreeActions } from '@/app/(admin)/_components/data-table-row-three-action';
import { AcademicYearResType } from '@/schemaValidations/academicYear.schema';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';

type AcademicYearType = AcademicYearResType['data'];

interface AcademicYearColumnProps {
	handleRedirectToDetail: (data: AcademicYearType) => void;
	handleEdit: (data: AcademicYearType) => void;
	handleDelete: (data: AcademicYearType) => void;
	pageNumber: number;
	pageSize: number;
}

export const getAcademicYearColumns = ({
	handleRedirectToDetail,
	handleEdit,
	handleDelete,
	pageNumber,
	pageSize,
}: AcademicYearColumnProps): ColumnDef<AcademicYearType>[] => [
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
		accessorKey: 'academicYearId',
		header: 'Mã năm học',
	},
	{
		accessorKey: 'displayAcademicYearName',
		header: 'Năm học hiển thị',
	},
	{
		accessorKey: 'yearStart',
		header: 'Thời gian bắt đầu',
		cell: ({ row }) => (
			<span>
				{row.original.yearStart
					? new Date(row.original.yearStart).toLocaleDateString('vi-VN')
					: '_'}
			</span>
		),
	},
	{
		accessorKey: 'yearEnd',
		header: 'Thời gian kết thúc',
		cell: ({ row }) => (
			<span>
				{row.original.yearEnd
					? new Date(row.original.yearEnd).toLocaleDateString('vi-VN')
					: '_'}
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
