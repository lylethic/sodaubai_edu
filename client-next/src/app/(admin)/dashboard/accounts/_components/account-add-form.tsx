'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { handleErrorApi } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import {
	AccountAddResType,
	CreateAccountBody,
	CreateAccountBodyType,
} from '@/schemaValidations/account.schema';

import SchoolSelect from '../../../_components/school-select';
import RoleSelect from './role-select';
import accountApiRequest from '@/apiRequests/account';

type Account = AccountAddResType['data'];

export default function AccountAddForm({ account }: { account?: Account }) {
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	//
	const form = useForm<CreateAccountBodyType>({
		resolver: zodResolver(CreateAccountBody),
		defaultValues: {
			RoleId: account?.roleId ?? 0,
			SchoolId: account?.schoolId ?? 0,
			Email: account?.email ?? '',
			Password: account?.password ?? '',
		},
	});

	const createAccount = async (values: CreateAccountBodyType) => {
		setLoading(true);
		try {
			const result = await accountApiRequest.addAccount({ ...values });

			toast({
				description: result.payload.message,
			});
			router.push('/dashboard/accounts');
			router.refresh();
		} catch (error: any) {
			handleErrorApi({ error, setError: form.setError });
		} finally {
			setLoading(false);
		}
	};

	async function onSubmit(values: CreateAccountBodyType) {
		if (loading) return;
		if (!account) {
			await createAccount(values);
		}
	}

	return (
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
					name='RoleId'
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
					name='SchoolId'
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
					name='Email'
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
				<FormField
					control={form.control}
					name='Password'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Mật khẩu</FormLabel>
							<FormControl>
								<Input placeholder='Mật khẩu' type='password' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type='submit' className='!mt-8 w-full'>
					{account ? 'Cập nhật tài khoản' : 'Thêm tài khoản'}
				</Button>
			</form>
		</Form>
	);
}
