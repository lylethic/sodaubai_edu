import React, { HTMLProps } from 'react';
import { DataTableRowThreeActions } from '@/app/(admin)/_components/data-table-row-three-action';
import { AcademicYearResType } from '@/schemaValidations/academicYear.schema';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { RollCallResType } from '@/schemaValidations/rollcall-schema';
import { formatDateToDDMMYYYY, formatDateToVietnam } from '@/lib/utils';

type EvaluationType = RollCallResType['data'];

interface RollCallColumnProps {
	handleRedirectToDetail: (data: EvaluationType) => void;
	handleEdit: (data: EvaluationType) => void;
	handleDelete: (data: EvaluationType) => void;
	pageNumber: number;
	pageSize: number;
}

export const getWeeklyEvaluationsColumns = ({
	handleRedirectToDetail,
	handleEdit,
	handleDelete,
	pageNumber,
	pageSize,
}: RollCallColumnProps): ColumnDef<EvaluationType>[] => [
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
		accessorKey: 'rollCallId',
		header: 'Mã điểm danh',
	},
	{
		accessorKey: 'weekId',
		header: 'Mã tuần học',
	},
	{
		accessorKey: 'classId',
		header: 'Mã lớp học',
	},
	{
		accessorKey: 'weekName',
		header: 'Tuần học',
	},
	{
		accessorKey: 'className',
		header: 'Lớp học',
	},
	{
		accessorKey: 'dayOfTheWeek',
		header: 'Thứ trong tuần',
	},
	{
		accessorKey: 'numberOfAttendants',
		header: 'Điểm danh',
		cell: ({ row }) => (
			<span className='font-medium'>{row.original.numberOfAttendants}</span>
		),
	},
	{
		accessorKey: 'dateAt',
		header: 'Ngày điểm danh',
		cell: ({ row }) => (
			<span>
				{row.original.dateAt ? formatDateToDDMMYYYY(row.original.dateAt) : '_'}
			</span>
		),
	},
	{
		accessorKey: 'dateCreated',
		header: 'Thời gian tạo',
		cell: ({ row }) => (
			<span>
				{row.original.dateCreated
					? formatDateToDDMMYYYY(row.original.dateCreated)
					: '_'}
			</span>
		),
	},
	{
		accessorKey: 'dateUpdated',
		header: 'Thời gian cập nhật',
		cell: ({ row }) => (
			<span>
				{row.original.dateUpdated
					? formatDateToDDMMYYYY(row.original.dateUpdated)
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
