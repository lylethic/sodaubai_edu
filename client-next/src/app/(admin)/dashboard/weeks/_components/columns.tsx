import React, { HTMLProps } from 'react';
import { DataTableRowThreeActions } from '@/app/(admin)/_components/data-table-row-three-action';
import { WeekListResType } from '@/schemaValidations/week.schema';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';

type WeekType = WeekListResType['data'];

interface WeekColumnProps {
	handleRedirectToDetail: (data: WeekType) => void;
	handleEdit: (data: WeekType) => void;
	handleDelete: (data: WeekType) => void;
	pageNumber: number;
	pageSize: number;
}

export const getWeekColumns = ({
	handleRedirectToDetail,
	handleEdit,
	handleDelete,
	pageNumber,
	pageSize,
}: WeekColumnProps): ColumnDef<WeekType>[] => [
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
		accessorKey: 'weekId',
		header: 'Mã tuần học',
	},
	{
		accessorKey: 'weekName',
		header: 'Tuần học',
	},
	{
		accessorKey: 'weekStart',
		header: 'Tuần bắt đầu',
	},
	{
		accessorKey: 'weekEnd',
		header: 'Tuần kết thúc',
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
		accessorKey: 'semesterId',
		header: 'Mã năm học',
	},
	{
		accessorKey: 'semesterName',
		header: 'Năm học',
	},
	{
		accessorKey: 'dateStart',
		header: 'Ngày bắt đầu',
	},
	{
		accessorKey: 'dateEnd',
		header: 'Ngày kết thúc',
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
