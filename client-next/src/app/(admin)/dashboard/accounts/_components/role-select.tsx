// components/RoleSelect.tsx
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
import { useFormContext } from 'react-hook-form';
import roleApiRequest from '@/apiRequests/role';
import { RoleType } from '@/types/roleType';

interface RoleSelectProps {
	selectedRoleId: number | null;
	onSelectRole: (RoleId: number) => void;
}

const RoleSelect = ({ selectedRoleId, onSelectRole }: RoleSelectProps) => {
	const [Roles, setRoles] = useState<RoleType[]>([]);

	const { setValue } = useFormContext();

	const getRoleList = async () => {
		try {
			const response = await roleApiRequest.getRoleNoPagination();
			const data = response.payload.data;
			const RolesArray = Array.isArray(data) ? data : [data];
			setRoles(RolesArray);
		} catch (error) {
			console.error('Failed to fetch Roles', error);
		}
	};

	useEffect(() => {
		getRoleList();
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
							!selectedRoleId && 'text-muted-foreground'
						)}
					>
						{selectedRoleId
							? Roles.find((Role) => Role.roleId === selectedRoleId)?.nameRole
							: 'Chọn vai trò...'}
						<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-full p-0'>
					<Command>
						<CommandInput placeholder='Nhập MÃ để tìm kiếm...' />
						<CommandList>
							{Roles.length === 0 ? (
								<CommandEmpty>Không tìm thấy.</CommandEmpty>
							) : (
								<CommandGroup>
									{Roles.map((role) => (
										<CommandItem
											value={String(role.roleId)}
											key={role.roleId}
											onSelect={() => {
												onSelectRole(role.roleId);
												setValue('RoleId', role.roleId);
											}}
										>
											<Check
												className={cn(
													'mr-2 h-4 w-4',
													role.roleId === selectedRoleId
														? 'opacity-100'
														: 'opacity-0'
												)}
											/>
											{role.nameRole}
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

export default RoleSelect;
