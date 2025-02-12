import React, { HTMLProps } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { LopHocResType } from '@/schemaValidations/lopHoc.shema';
import { DataTableRowThreeActions } from '@/app/(admin)/_components/data-table-row-three-action';
import { Button } from '@/components/ui/button';
import { SemesterResType } from '@/schemaValidations/semester.schema';

type SemesterType = SemesterResType['data'];

interface SemesterColumnProps {
	handleRedirectToDetail: (data: SemesterType) => void;
	handleEdit: (data: SemesterType) => void;
	handleDelete: (data: SemesterType) => void;
	pageNumber: number;
	pageSize: number;
}

export const getSemesterColumns = ({
	handleRedirectToDetail,
	handleEdit,
	handleDelete,
	pageNumber,
	pageSize,
}: SemesterColumnProps): ColumnDef<SemesterType>[] => [
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
		accessorKey: 'semesterId',
		header: 'Mã học kỳ',
	},
	{
		accessorKey: 'semesterName',
		header: 'Tên hiển thị học kỳ',
	},
	{
		accessorKey: 'academicYearId',
		header: 'Mã năm học',
	},
	{
		accessorKey: 'displayAcademicYearName',
		header: 'Tên hiển thị năm học',
	},
	{
		accessorKey: 'dateStart',
		header: 'Thời gian bắt đầu',
		cell: ({ row }) => {
			const date = row.original.dateStart
				? new Date(row.original.dateStart)
				: null;
			return date ? date.toLocaleDateString('vi-VN') : '_';
		},
	},
	{
		accessorKey: 'dateEnd',
		header: 'Thời gian kết thúc',
		cell: ({ row }) => {
			const date = row.original.dateEnd ? new Date(row.original.dateEnd) : null;
			return date ? date.toLocaleDateString('vi-VN') : '_';
		},
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
		accessorKey: 'yearStart',
		header: 'Thời gian năm học bắt đầu',
		cell: ({ row }) => {
			const date = row.original.yearStart
				? new Date(row.original.yearStart)
				: null;
			return date ? date.toLocaleDateString('vi-VN') : '_';
		},
	},
	{
		accessorKey: 'yearEnd',
		header: 'Thời gian năm học kết thúc',
		cell: ({ row }) => {
			const date = row.original.yearEnd ? new Date(row.original.yearEnd) : null;
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
