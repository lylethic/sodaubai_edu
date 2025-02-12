'use client';

import React, { useState } from 'react';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
	UpdateAccountBody,
	UpdateAccountBodyType,
} from '@/schemaValidations/account.schema';
import { useToast } from '@/hooks/use-toast';
import accountApiRequest from '@/apiRequests/account';
import { handleErrorApi } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import RoleSelect from './role-select';
import SchoolSelect from '../../../_components/school-select';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';

type Props = {
	params: { id: string };
	account: UpdateAccountBodyType;
};

export default function EditAccountForm({ params, account }: Props) {
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<UpdateAccountBodyType>({
		resolver: zodResolver(UpdateAccountBody),
		defaultValues: {
			roleId: account?.roleId ?? 0,
			schoolId: account?.schoolId ?? 0,
			email: account?.email ?? '',
			dateCreated: account.dateCreated ?? null,
			dateUpdated: account.dateUpdated ?? null,
		},
	});

	if (!account) {
		return <div>Không tìm thấy tài khoản</div>;
	}

	const updateAccount = async (values: UpdateAccountBodyType) => {
		setLoading(true);

		try {
			const result = await accountApiRequest.updateAccount(
				Number(params.id),
				values
			);

			toast({
				description: result.payload.message,
			});

			router.refresh();
		} catch (error: any) {
			handleErrorApi({ error, setError: form.setError });
		} finally {
			setLoading(false);
		}
	};

	async function onSubmit(values: UpdateAccountBodyType) {
		if (loading) return;
		if (account) {
			await updateAccount(values);
		}
	}

	return (
		<div className='flex flex-col items-center w-full'>
			<Button
				variant={'ghost'}
				className='border my-4'
				onClick={() => router.back()}
			>
				<ArrowLeft />
			</Button>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit, (error) => {
						console.log(error);
					})}
					className='text-lg space-y-2 max-w-[600px] flex-shrink-0 w-full'
					noValidate
				>
					<FormField
						control={form.control}
						name='roleId'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Vai trò</FormLabel>
								<FormControl>
									<RoleSelect
										selectedRoleId={field.value}
										onSelectRole={(roleId) => field.onChange(roleId)}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='schoolId'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Trường học</FormLabel>
								<SchoolSelect
									selectedSchoolId={field.value}
									onSelectSchool={(schoolId) => field.onChange(schoolId)}
								/>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Nhập Email</FormLabel>
								<FormControl>
									<Input placeholder='Nhập Email' type='email' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button variant={'default'} type='submit' className='!mt-8 w-full'>
						Cập nhật tài khoản
					</Button>
				</form>
			</Form>
		</div>
	);
}
