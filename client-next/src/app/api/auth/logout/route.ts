//server nextjs

import authApiRequest from '@/apiRequests/auth';
import { HttpError } from '@/lib/http';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
	const res = await request.json();
	const force = res.force as boolean | undefined;

	// Nếu buộc đăng xuất được kích hoạt, hãy xóa cookie ngay lập tức
	if (force) {
		return Response.json(
			{
				message: 'Buộc đăng xuất thành công.',
			},
			{
				status: 200,
				headers: {
					// Xoa cookie sessionToken
					'Set-Cookie': 'accessToken=; Path=/; HttpOnly; Max-Age=0',
				},
			}
		);
	}

	const cookieStore = cookies();
	const accessToken = cookieStore.get('accessToken');

	if (!accessToken) {
		return Response.json(
			{ message: 'Khong nhan duoc accessToken' },
			{
				status: 401,
			}
		);
	}

	try {
		const result = await authApiRequest.logoutFromNextServerToServer(
			accessToken.value
		);

		return Response.json(result.payload, {
			status: 200,
			headers: {
				'Set-Cookie':
					'accessToken=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax; Secure',
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
					message: 'Lỗi không xác định',
				},
				{
					status: 500,
				}
			);
		}
	}
}
