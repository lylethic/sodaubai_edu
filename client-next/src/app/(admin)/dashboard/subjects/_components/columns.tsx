import React, { HTMLProps } from 'react';
import { DataTableRowThreeActions } from '@/app/(admin)/_components/data-table-row-three-action';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { SubjectResType } from '@/schemaValidations/subject.schema';

type SubjectType = SubjectResType['data'];

interface SubjectColumnProps {
	handleRedirectToDetail: (data: SubjectType) => void;
	handleEdit: (data: SubjectType) => void;
	handleDelete: (data: SubjectType) => void;
	pageNumber: number;
	pageSize: number;
}

export const getSubjectsColumns = ({
	handleRedirectToDetail,
	handleEdit,
	handleDelete,
	pageNumber,
	pageSize,
}: SubjectColumnProps): ColumnDef<SubjectType>[] => [
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
		accessorKey: 'subjectId',
		header: 'Mã môn học',
	},
	{
		accessorKey: 'displayAcademicYear_Name',
		header: 'Năm học',
	},
	{
		accessorKey: 'yearStart',
		header: 'Thời gian năm học bắt đầu',
	},
	{
		accessorKey: 'yearEnd',
		header: 'Thời gian năm học kết thúc',
	},
	{
		accessorKey: 'gradeId',
		header: 'Mã khối lớp',
	},
	{
		accessorKey: 'gradeName',
		header: 'Khối lớp',
	},
	{
		accessorKey: 'subjectName',
		header: 'Tên môn học hiển thị',
		cell: ({ row }) => (
			<span className='font-medium'>{row.original.subjectName}</span>
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
