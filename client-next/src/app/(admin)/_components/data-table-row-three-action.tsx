'use client';
import {
	ArrowBottomLeftIcon,
	ArrowBottomRightIcon,
	DotsHorizontalIcon,
} from '@radix-ui/react-icons';
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
import { CheckCircle, Edit, Trash } from 'lucide-react';

interface DataTableRowActionsProps<TData> {
	row: Row<TData>;
	onDetail: (data: TData) => void;
	onEdit: (data: TData) => void;
	onDelete: (data: TData) => void;
}

export function DataTableRowThreeActions<TData>({
	row,
	onDetail,
	onEdit,
	onDelete,
}: DataTableRowActionsProps<TData>) {
	const task = row.original;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='ghost'
					className='flex h-10 w-10 p-0 data-[state=open]:bg-muted border rounded-xl'
				>
					<DotsHorizontalIcon />
					<span className='sr-only'>Menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='w-[160px]'>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => onDetail(task)}>
					Xem chi tiết
					<DropdownMenuShortcut>
						<CheckCircle color='green' size={'20px'} />
					</DropdownMenuShortcut>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => onEdit(task)}>
					Sửa
					<DropdownMenuShortcut>
						<Edit size={'20px'} />
					</DropdownMenuShortcut>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => onDelete(task)}>
					Xóa
					<DropdownMenuShortcut>
						<Trash color='red' size={'20px'} />
					</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
