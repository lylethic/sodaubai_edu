import React, { HTMLProps } from 'react';
import { DataTableRowThreeActions } from '@/app/(admin)/_components/data-table-row-three-action';
import { ColumnDef } from '@tanstack/react-table';
import { ClassificationResType } from '@/schemaValidations/xepLoaiTietHoc.schema';

type ClassifyType = ClassificationResType['data'];

interface ClassifyColumnProps {
	handleRedirectToDetail: (data: ClassifyType) => void;
	handleEdit: (data: ClassifyType) => void;
	handleDelete: (data: ClassifyType) => void;
	pageNumber: number;
	pageSize: number;
}

export const getClassifyColumns = ({
	handleRedirectToDetail,
	handleEdit,
	handleDelete,
	pageNumber,
	pageSize,
}: ClassifyColumnProps): ColumnDef<ClassifyType>[] => [
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
		accessorKey: 'classificationId',
		header: 'Mã xếp loại',
		cell: ({ row }) => (
			<span>{row.original.classificationId || row.original.id}</span>
		),
	},
	{
		accessorKey: 'classifyName',
		header: 'Tên hiển thị',
		cell: ({ row }) => (
			<span>Xếp loại {row.original.classifyName || row.original.name}</span>
		),
	},
	{
		accessorKey: 'score',
		header: 'Số điểm',
		cell: ({ row }) => <span>{row.original.score ?? 0}</span>,
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
