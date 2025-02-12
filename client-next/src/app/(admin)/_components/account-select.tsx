'use client';
import React, { useEffect, useState } from 'react';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn, handleErrorApi } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';
import accountApiRequest from '@/apiRequests/account';
import { AccountResType } from '@/schemaValidations/account.schema';

interface Props {
	selectedAccount?: number | null;
	selectedRoleId: number | null;
	selectedSchoolId: number | null;
	pageNumber?: number;
	pageSize?: number;
	onSelectedAccount: (accountId: number) => void;
}

export default function AccountSelect({
	selectedRoleId,
	selectedSchoolId,
	selectedAccount,
	pageNumber = 1,
	pageSize = 20,
	onSelectedAccount,
}: Props) {
	const [accounts, setAccounts] = useState<AccountResType['data'][]>([]);
	const [currentPage, setCurrentPage] = useState(pageNumber);
	const [hasMore, setHasMore] = useState(true); // To track if more pages are available
	const { setValue } = useFormContext();

	useEffect(() => {
		const fetchAccounts = async (
			page: number,
			size: number,
			isAppending = false
		) => {
			try {
				const response = await accountApiRequest.accountsByRoleIdSchoolId(
					selectedRoleId,
					selectedSchoolId,
					page,
					size
				);
				const data = response.payload.data;
				const result = Array.isArray(data) ? data : [];
				if (isAppending) {
					setAccounts((prev) => [...prev, ...result]);
				} else {
					setAccounts(result);
				}
				setHasMore(result.length === size); // Check if we got a full page
			} catch (error: any) {
				handleErrorApi({ error });
			}
		};

		if (selectedSchoolId) fetchAccounts(currentPage, pageSize);
		else setAccounts([]);
	}, [selectedSchoolId, selectedRoleId, currentPage]);

	const handleLoadMore = () => {
		if (hasMore) setCurrentPage((prev) => prev + 1);
	};

	return (
		<Popover modal={true}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					className={cn(
						'w-full justify-between',
						!selectedAccount && 'text-muted-foreground'
					)}
				>
					{selectedAccount
						? accounts.find((key) => key.accountId === selectedAccount)
								?.email || selectedAccount
						: 'Chọn email tài khoản...'}
					<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-full p-0'>
				<Command>
					<CommandInput placeholder='Nhập MÃ tài khoản để tìm kiếm...' />
					<CommandList>
						{accounts.length === 0 ? (
							<CommandEmpty>Không tìm thấy.</CommandEmpty>
						) : (
							<>
								<CommandGroup>
									{accounts.map((key) => (
										<CommandItem
											key={key.accountId}
											value={String(key.accountId)}
											onSelect={() => {
												onSelectedAccount(key.accountId);
												setValue('ClassId', key.accountId);
											}}
										>
											<Check
												className={cn(
													'mr-2 h-4 w-4',
													key.accountId === selectedAccount
														? 'opacity-100'
														: 'opacity-0'
												)}
											/>
											{key.email}
										</CommandItem>
									))}
								</CommandGroup>
								{hasMore && (
									<div className='flex justify-center p-2'>
										<Button variant='link' onClick={handleLoadMore}>
											Load More
										</Button>
									</div>
								)}
							</>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
