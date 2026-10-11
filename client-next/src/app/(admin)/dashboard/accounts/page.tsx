import React from 'react';
import { cookies } from 'next/headers';
import accountApiRequest from '@/apiRequests/account';
import AccountList from './_components/account-list';
import AccountAddButton from './_components/account-add-button';
import { AccountType } from '@/types/accountType';

export default async function AccountListPage() {
	const cookieStore = cookies();
	const token = cookieStore.get('accessToken')?.value;

	let initialAccounts: AccountType[] = [];
	let initialTotalCount = 0;

	if (token) {
		try {
			const res = await accountApiRequest.accounts(1, 20, undefined, token);
			const resData = res.payload?.data as any;
			const items = Array.isArray(resData?.items)
				? resData.items
				: Array.isArray(resData)
				? resData
				: [];
			initialAccounts = items.map((u: any) => ({
				...u,
				id: u.id ?? u.accountId,
				accountId: u.id ?? u.accountId,
				roleName: u.roleName || (u.username ? `@${u.username}` : 'User'),
			}));
			initialTotalCount = resData?.totalCount ?? initialAccounts.length;
		} catch (error) {
			console.error('Failed to load accounts in Server Component', error);
		}
	}

	return (
		<div className='text-sm block w-full overflow-x-auto'>
			<h1 className='text-2xl text-center uppercase p-2 border-b'>
				Danh sách tài khoản
			</h1>
			<AccountAddButton />
			<AccountList
				initialAccounts={initialAccounts}
				initialTotalCount={initialTotalCount}
			/>
		</div>
	);
}
