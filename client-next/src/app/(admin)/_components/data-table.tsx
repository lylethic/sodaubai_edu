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
import { PaginationWithLinks } from '@/components/pagination-with-links';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	pageSize: number;
	pageNumber: number;
	totalCount: number;
	toggleSelected?: (value?: boolean) => void;
	onPageChange: (newPage: number) => void;
	onPageSizeChange: (newPageSize: number) => void;
	onSelectedRowsChange: (data: TData[]) => void;
}

export default function DataTable<TData, TValue>({
	columns,
	data,
	pageSize,
	pageNumber,
	totalCount,
	onPageChange,
	onPageSizeChange,
	onSelectedRowsChange,
}: DataTableProps<TData, TValue>) {
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);

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
		onColumnFiltersChange: setColumnFilters,
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
				{/* <div>
					<label>Row Selection State:</label>
					<pre>{JSON.stringify(table.getState().rowSelection, null, 2)}</pre>
					</div> */}
			</div>
			<div className='text-sm ps-2 mt-4'>
				{Object.keys(rowSelection).length}/
				{table.getPreFilteredRowModel().rows.length} được chọn.
			</div>
			<div className='py-4'>
				<PaginationWithLinks
					page={pageNumber}
					pageSize={pageSize}
					totalCount={totalCount}
					onPageChange={(newPage) => {
						setRowSelection({}); // clear
						onPageChange(newPage);
					}}
					onPageSizeChange={onPageSizeChange}
					pageSizeSelectOptions={{ pageSizeOptions: [5, 10, 20, 50] }}
				/>
			</div>
		</>
	);
}
