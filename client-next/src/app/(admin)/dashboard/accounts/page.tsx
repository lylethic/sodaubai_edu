import React from 'react';
import AccountList from './_components/account-list';
import AccountAddButton from './_components/account-add-button';

export default async function AccountListPage() {
	return (
		<div className='text-sm block w-full overflow-x-auto'>
			<h1 className='text-2xl text-center uppercase p-2 border-b'>
				Danh sách tài khoản
			</h1>
			<AccountAddButton />
			<AccountList />
		</div>
	);
}
