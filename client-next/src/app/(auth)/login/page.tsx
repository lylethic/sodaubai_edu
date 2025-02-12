import React from 'react';
import LoginForm from './login-form';
import Header from '@/components/header/header';

export default function LoginPage() {
	return (
		<section className='h-full overflow-y-auto'>
			<Header />
			<div className='flex flex-col items-center justify-center p-4 w-full min-h-[620px]'>
				<section className='flex flex-col items-center justify-center'>
					<h1 className='text-xl font-semibold text-center'>Đăng nhập</h1>
				</section>
				<div className='flex justify-center w-full'>
					<LoginForm />
				</div>
			</div>
		</section>
	);
}
