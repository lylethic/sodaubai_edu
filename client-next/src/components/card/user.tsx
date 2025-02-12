import React from 'react';
import accountApiRequest from '@/apiRequests/account';
import { cookies } from 'next/headers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { decodeJWT } from '@/lib/utils';
import { JwtAccessTokenPayload } from '@/types/jwt';
import { User } from 'lucide-react';

export default async function CardUser() {
	const cookieStore = cookies();
	const accessToken = cookieStore.get('accessToken');
	if (!accessToken) {
		throw new Error('Invalid accessToken');
	}

	let amountOfAccount = 0;

	try {
		const decodeToken = decodeJWT<JwtAccessTokenPayload>(accessToken.value);
		if (!decodeToken) {
			throw new Error('Invalid decoded token');
		}

		const { payload } = await accountApiRequest.countNumberOfAccountsBySchool(
			decodeToken.SchoolId,
			accessToken.value
		);

		amountOfAccount = payload ?? 0;
	} catch (error) {}

	return (
		<Card className='w-[20%]'>
			<CardHeader>
				<CardTitle>Số lượng tài khoản</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='flex font-bold text-lg'>
					<User />
					{amountOfAccount}
				</div>
			</CardContent>
		</Card>
	);
}
