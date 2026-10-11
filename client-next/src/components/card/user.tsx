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

		const schoolId = Number(decodeToken.SchoolId ?? 0);
		const { payload } = await accountApiRequest.countNumberOfAccountsBySchool(
			schoolId,
			accessToken.value
		);

		const data: any = payload?.data;
		if (typeof data === 'number') {
			amountOfAccount = data;
		} else if (data && typeof data.totalCount === 'number') {
			amountOfAccount = data.totalCount;
		} else if (data && Array.isArray(data.items)) {
			amountOfAccount = data.items.length;
		} else {
			amountOfAccount = 0;
		}
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
