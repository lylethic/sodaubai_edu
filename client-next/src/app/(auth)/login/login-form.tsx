'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

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
import { LoginBody, LoginBodyType } from '@/schemaValidations/auth.schema';
import { useToast } from '@/hooks/use-toast';
import authApiRequest from '@/apiRequests/auth';
import { useRouter } from 'next/navigation';
import { decodeJWT, handleErrorApi } from '@/lib/utils';
import { useAppContext } from '@/app/app-provider';
import { JwtAccessTokenPayload } from '@/types/jwt';
import { Loader2 } from 'lucide-react';

const LoginForm = () => {
	const [loading, setLoading] = useState(false);
	const { setUser } = useAppContext();
	const { toast } = useToast();
	const router = useRouter();

	//
	const form = useForm<LoginBodyType>({
		resolver: zodResolver(LoginBody),
		defaultValues: {
			Email: '',
			Password: '',
		},
	});

	async function onSubmit(values: LoginBodyType) {
		if (loading) return;
		setLoading(true);
		try {
			const result = await authApiRequest.login(values);
			// console.log(result);

			const decodeToken = decodeJWT<JwtAccessTokenPayload>(
				result.payload.data.token
			);

			if (!decodeToken) {
				return toast({
					description: 'Access Token not found',
				});
			}

			await authApiRequest.auth({
				accessToken: result.payload.data.token,
				expiresAt: result.payload.data.expiresAt,
			});

			toast({
				description: result.payload.message,
			});

			setUser({
				accountId: decodeToken.AccountId,
				roleId: decodeToken.RoleId,
				schoolId: decodeToken.SchoolId,
				email: decodeToken.Email,
			});
			router.push('/sodaubai');
			router.refresh();
		} catch (error: any) {
			handleErrorApi({
				error,
				setError: form.setError,
				duration: 3000,
			});
		} finally {
			setLoading(false);
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-2 max-w-[600px] flex-shrink-0 w-full'
				noValidate
			>
				<FormField
					control={form.control}
					name='Email'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									type='email'
									placeholder='Nhập email người dùng...'
									autoComplete='email'
									{...field}
								/>
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
								<Input
									type='password'
									placeholder='Nhập mật khẩu..'
									autoComplete='current-password'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type='submit' className='!mt-8 w-full'>
					{loading ? (
						<>
							<Loader2 className='mr-2 h-4 w-4 animate-spin' />
							Đang xử lý...
						</>
					) : (
						'Đăng nhập'
					)}
				</Button>
			</form>
		</Form>
	);
};

export default LoginForm;
