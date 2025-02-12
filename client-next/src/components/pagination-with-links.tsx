'use client';
import React, { ReactNode } from 'react';
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';

import { cn } from '@/lib/utils';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

export interface PaginationWithLinksProps {
	pageSizeSelectOptions?: {
		pageSizeOptions: number[];
	};
	totalCount: number;
	pageSize: number;
	page: number;
	onPageChange: (newPage: number) => void; // page change
	onPageSizeChange: (newPageSize: number) => void; // page size change
}

export function PaginationWithLinks({
	pageSizeSelectOptions,
	pageSize,
	totalCount,
	page,
	onPageChange, // callback for changing page
	onPageSizeChange, // callback for changing page size
}: PaginationWithLinksProps) {
	const totalPageCount = Math.ceil(totalCount / pageSize);

	const renderPageNumbers = () => {
		const items: ReactNode[] = [];
		const maxVisiblePages = 5;

		if (totalPageCount <= maxVisiblePages) {
			for (let i = 1; i <= totalPageCount; i++) {
				items.push(
					<PaginationItem key={i} className='cursor-pointer'>
						<PaginationLink
							onClick={() => onPageChange(i)}
							isActive={page === i}
						>
							{i}
						</PaginationLink>
					</PaginationItem>
				);
			}
		} else {
			items.push(
				<PaginationItem key={1} className='cursor-pointer'>
					<PaginationLink onClick={() => onPageChange(1)} isActive={page === 1}>
						1
					</PaginationLink>
				</PaginationItem>
			);

			if (page > 3) {
				items.push(
					<PaginationItem key='ellipsis-start' className='cursor-pointer'>
						<PaginationEllipsis />
					</PaginationItem>
				);
			}

			const start = Math.max(2, page - 1);
			const end = Math.min(totalPageCount - 1, page + 1);

			for (let i = start; i <= end; i++) {
				items.push(
					<PaginationItem key={i}>
						<PaginationLink
							onClick={() => onPageChange(i)}
							isActive={page === i}
							className='cursor-pointer'
						>
							{i}
						</PaginationLink>
					</PaginationItem>
				);
			}

			if (page < totalPageCount - 2) {
				items.push(
					<PaginationItem key='ellipsis-end' className='cursor-pointer'>
						<PaginationEllipsis />
					</PaginationItem>
				);
			}

			items.push(
				<PaginationItem key={totalPageCount} className='cursor-pointer'>
					<PaginationLink
						onClick={() => onPageChange(totalPageCount)}
						isActive={page === totalPageCount}
						className='cursor-pointer'
					>
						{totalPageCount}
					</PaginationLink>
				</PaginationItem>
			);
		}

		return items;
	};

	return (
		<div className='flex flex-col md:flex-row items-center gap-3 w-full p-2'>
			{pageSizeSelectOptions && (
				<div className='flex flex-col gap-4 flex-1'>
					<SelectRowsPerPage
						options={pageSizeSelectOptions.pageSizeOptions}
						setPageSize={onPageSizeChange}
						pageSize={pageSize}
					/>
				</div>
			)}
			<Pagination className={cn({ 'md:justify-end': pageSizeSelectOptions })}>
				<PaginationContent className='max-sm:gap-0'>
					<PaginationItem className='cursor-pointer'>
						<PaginationPrevious
							onClick={() => onPageChange(Math.max(page - 1, 1))} // Change to previous page
							aria-disabled={page === 1}
							className={
								page === 1 ? 'pointer-events-none opacity-50' : undefined
							}
						/>
					</PaginationItem>
					{renderPageNumbers()}
					<PaginationItem className='cursor-pointer'>
						<PaginationNext
							onClick={() => onPageChange(Math.min(page + 1, totalPageCount))} // Change to next page
							aria-disabled={page === totalPageCount}
							className={
								page === totalPageCount
									? 'pointer-events-none opacity-50'
									: undefined
							}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	);
}

function SelectRowsPerPage({
	options,
	setPageSize,
	pageSize,
}: {
	options: number[];
	setPageSize: (newSize: number) => void;
	pageSize: number;
}) {
	return (
		<div className='flex items-center gap-4'>
			<span className='whitespace-nowrap text-sm'>Rows per page</span>

			<Select
				value={String(pageSize)}
				onValueChange={(value) => setPageSize(Number(value))}
			>
				<SelectTrigger>
					<SelectValue placeholder='Select page size'>
						{String(pageSize)}
					</SelectValue>
				</SelectTrigger>
				<SelectContent>
					{options.map((option) => (
						<SelectItem key={option} value={String(option)}>
							{option}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
