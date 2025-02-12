'use client';

import React, { useEffect, useState } from 'react';
import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	RowSelectionState,
	SortingState,
	useReactTable,
	getFacetedRowModel,
	getFacetedUniqueValues,
} from '@tanstack/react-table';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	toggleSelected?: (value?: boolean) => void;
	onSelectedRowsChange: (data: TData[]) => void;
}

export default function DataTableNoPagination<TData, TValue>({
	columns,
	data,
	onSelectedRowsChange,
}: DataTableProps<TData, TValue>) {
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

	useEffect(() => {
		onSelectedRowsChange(
			table.getSelectedRowModel().flatRows.map((row) => row.original)
		);
	}, [rowSelection, onSelectedRowsChange]);

	const table = useReactTable({
		data,
		columns,
		enableRowSelection: true,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			rowSelection,
		},
		onRowSelectionChange: setRowSelection,
		debugTable: true,
	});

	useEffect(() => {
		setRowSelection({});
	}, [data]);

	return (
		<>
			<div className='border border-gray-200 rounded'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id} className='ps-3 py-3'>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
											  )}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
									// onClick={row.getToggleSelectedHandler()}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className='h-24 text-center'
								>
									Không có kết quả
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className='text-sm ps-2 mt-4'>
				{Object.keys(rowSelection).length}/
				{table.getPreFilteredRowModel().rows.length} được chọn.
			</div>
		</>
	);
}
