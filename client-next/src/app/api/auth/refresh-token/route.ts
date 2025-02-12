//server nextjs
// Refreshtoken
import authApiRequest from '@/apiRequests/auth';
import { HttpError } from '@/lib/http';
import { decodeJWT } from '@/lib/utils';
import { JwtAccessTokenPayload } from '@/types/jwt';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
	const cookieStore = cookies();
	const accessToken = cookieStore.get('accessToken');

	if (!accessToken) {
		return Response.json(
			{ message: 'Không nhận được accessToken' },
			{
				status: 401,
			}
		);
	}

	try {
		const res = await authApiRequest.slideSessionFromNextServerToServer(
			accessToken.value
		);

		console.log(res);

		const newExpiresDate = new Date(res.payload.data.expiresAt);
		console.log(newExpiresDate);

		return Response.json(res.payload, {
			status: 200,
			headers: {
				'Set-Cookie': `accessToken=${accessToken.value}; Path=/; HttpOnly; Expires=${newExpiresDate}; SameSite=Lax; Secure`,
			},
		});
	} catch (error) {
		if (error instanceof HttpError) {
			return Response.json(error.payload, {
				status: error.status,
			});
		} else {
			Response.json(
				{
					message: 'Loi khong xac dinh',
				},
				{
					status: 500,
				}
			);
		}
	}
}
