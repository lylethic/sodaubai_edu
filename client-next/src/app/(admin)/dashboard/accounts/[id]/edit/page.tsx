import { cache } from 'react';
import { cookies } from 'next/headers';
import envConfig from '@/config';
import { Metadata, ResolvingMetadata } from 'next';
import { baseOpenGraph } from '@/app/shared-metadata';
import accountApiRequest from '@/apiRequests/account';
import EditAccountForm from '../../_components/edit-account-form';
import { Button } from '@/components/ui/button';

const getDetailAccount = cache(accountApiRequest.getDetail);

type Props = {
	params: { id: string };
	searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
	{ params, searchParams }: Props,
	parent: ResolvingMetadata
): Promise<Metadata> {
	const cookieStore = cookies();
	const accessToken = cookieStore.get('accessToken')!.value;
	const { payload } = await getDetailAccount(Number(params.id), accessToken);

	const account = payload.data;
	const url =
		envConfig.NEXT_PUBLIC_URL + '/dashboard/accounts/' + account.accountId;
	return {
		title: account.email,
		openGraph: {
			...baseOpenGraph,
			title: account.email,
			url,
		},
		alternates: {
			canonical: url,
		},
	};
}

export default async function AccountEditPage({ params }: Props) {
	const cookieStore = cookies();
	const token = cookieStore.get('accessToken');

	let account = null;
	if (!token) return;
	try {
		const { payload } = await getDetailAccount(Number(params.id), token.value);
		account = payload.data;
	} catch (error) {}

	return (
		<div className='py-6'>
			<h1 className='text-center text-lg font-medium uppercase'>
				cập nhật tài khoản
			</h1>
			<div className='flex items-center justify-center'>
				{!account ? (
					<div>Không tìm thấy tài khoản</div>
				) : (
					<EditAccountForm params={params} account={account} />
				)}
			</div>
		</div>
	);
}
