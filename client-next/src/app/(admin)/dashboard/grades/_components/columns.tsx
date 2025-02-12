import React, { HTMLProps } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { LopHocResType } from '@/schemaValidations/lopHoc.shema';
import { DataTableRowThreeActions } from '@/app/(admin)/_components/data-table-row-three-action';
import { Button } from '@/components/ui/button';
import { GradeResType } from '@/schemaValidations/grade.schema';
import { formatDateToDDMMYYYY } from '@/lib/utils';

type GradeType = GradeResType['data'];

interface GradesColumnProps {
	handleRedirectToDetail: (data: GradeType) => void;
	handleEdit: (data: GradeType) => void;
	handleDelete: (data: GradeType) => void;
	pageNumber: number;
	pageSize: number;
}

export const getGradesColumns = ({
	handleRedirectToDetail,
	handleEdit,
	handleDelete,
	pageNumber,
	pageSize,
}: GradesColumnProps): ColumnDef<GradeType>[] => [
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
		accessorKey: 'gradeId',
		header: 'Mã khối lớp',
	},
	{
		accessorKey: 'academicYearId',
		header: 'Mã năm học',
	},
	{
		accessorKey: 'displayAcademicYearName',
		header: 'Năm học',
	},
	{
		accessorKey: 'yearStart',
		header: 'Thời gian năm học bắt đầu',
		cell: ({ row }) => (
			<span>{formatDateToDDMMYYYY(row.original.yearStart)}</span>
		),
	},
	{
		accessorKey: 'yearEnd',
		header: 'Thời gian năm học kết thúc',
		cell: ({ row }) => (
			<span>{formatDateToDDMMYYYY(row.original.yearEnd)}</span>
		),
	},
	{
		accessorKey: 'gradeName',
		header: 'Tên khối',
	},
	{
		accessorKey: 'description',
		header: 'Ghi chú',
	},
	{
		accessorKey: 'dateCreated',
		header: 'Ngày tạo',
		cell: ({ row }) => (
			<span>{formatDateToDDMMYYYY(row.original.dateCreated)}</span>
		),
	},
	{
		accessorKey: 'dateUpdated',
		header: 'Ngày cập nhật',
		cell: ({ row }) => (
			<span>{formatDateToDDMMYYYY(row.original.dateUpdated)}</span>
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
