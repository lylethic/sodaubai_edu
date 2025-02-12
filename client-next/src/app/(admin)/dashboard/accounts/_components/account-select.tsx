'use client';

import { useState, useEffect } from 'react';
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
import { cn } from '@/lib/utils';
import schoolApiRequest from '@/apiRequests/school';
import { SchoolType } from '@/types/schoolType';
import { useFormContext } from 'react-hook-form';
import accountApiRequest from '@/apiRequests/account';
import { TeacherResType } from '@/schemaValidations/teacher.schema';
import { AccountAddResType } from '@/schemaValidations/account.schema';

interface AccountSelectProps {
	selectedAccount: number | null;
	onSelectAccount: (id: number) => void;
}

const AccountSelect = ({
	selectedAccount,
	onSelectAccount,
}: AccountSelectProps) => {
	const [accounts, setAccounts] = useState<AccountAddResType['data'][]>([]);

	const { setValue } = useFormContext();

	const getAccountsList = async () => {
		try {
			const response = await accountApiRequest.accountsSelect();
			const data = response.payload.data;
			const result = Array.isArray(data) ? data : [data];

			setAccounts(result);
		} catch (error) {
			console.error('Failed to fetch accounts', error);
		}
	};

	useEffect(() => {
		getAccountsList();
	}, []);

	return (
		<>
			<Popover>
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
							? accounts.find((item) => item.accountId === selectedAccount)
									?.email
							: 'Chọn email cho tài khoản'}
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
								<CommandGroup>
									{accounts.map((item) => (
										<CommandItem
											value={String(item.accountId)}
											key={item.schoolId}
											onSelect={() => {
												onSelectAccount(item.accountId);
												setValue('id', item.accountId);
											}}
										>
											<Check
												className={cn(
													'mr-2 h-4 w-4',
													item.accountId === selectedAccount
														? 'opacity-100'
														: 'opacity-0'
												)}
											/>
											{item.email}
										</CommandItem>
									))}
								</CommandGroup>
							)}
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</>
	);
};

export default AccountSelect;
