import React from 'react';
import AccountAddForm from '../_components/account-add-form';

export default function AccountPage() {
	return (
		<div className='flex flex-col items-center justify-center'>
			<h1>Tạo mới tài khoản</h1>
			<AccountAddForm />
		</div>
	);
}
