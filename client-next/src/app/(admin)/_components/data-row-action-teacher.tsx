'use client';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CheckCircle, NotebookTabs, Trash } from 'lucide-react';

interface DataTableRowActionsProps<TData> {
	row: Row<TData>;
	onDetail: (data: TData) => void;
	onRedirectToChiTietSoDauBai: (data: TData) => void;
}

export function DataTableRowTeacherActions<TData>({
	row,
	onDetail,
	onRedirectToChiTietSoDauBai,
}: DataTableRowActionsProps<TData>) {
	const task = row.original;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='ghost'
					className='flex h-10 w-10 p-0 data-[state=open]:bg-muted border rounded-xl'
				>
					<DotsHorizontalIcon className='h-4 w-4' />
					<span className='sr-only'>Menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='w-[160px]'>
				<DropdownMenuItem onClick={() => onRedirectToChiTietSoDauBai(task)}>
					Chi tiết sổ đầu bài
					<DropdownMenuShortcut>
						<NotebookTabs color='blue' size={'20px'} />
					</DropdownMenuShortcut>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => onDetail(task)}>
					Xem chi tiết
					<DropdownMenuShortcut>
						<CheckCircle color='green' size={'20px'} />
					</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
