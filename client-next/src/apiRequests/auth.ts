import http from '@/lib/http';
import { MessageResType } from './../schemaValidations/common.schema';
import {
	LoginBodyType,
	LoginResType,
	MyInfoResType,
	RegisterBodyType,
	RegisterResType,
	SlideSessionResType,
} from '@/schemaValidations/auth.schema';

const authApiRequest = {
	login: (body: LoginBodyType) => http.post<LoginResType>('/auth/login', body),

	register: (body: RegisterBodyType) =>
		http.post<RegisterResType>('/auth/register', body),

	auth: (body: { accessToken: string; expiresAt: string }) =>
		http.post<RegisterResType>('/api/auth', body, {
			baseUrl: '', // Send to Next.js route handler
		}),

	logoutFromNextServerToServer: (accessToken: string) =>
		http.post<MessageResType>(
			'/auth/logout',
			{},
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}
		),

	logoutFromNextClientToNextServer: (
		force?: boolean | undefined,
		signal?: AbortSignal | undefined
	) =>
		http.post<MessageResType>(
			'/api/auth/logout',
			{ force },
			{
				baseUrl: '',
				signal,
			}
		),

	slideSessionFromNextServerToServer: (accessToken: string) =>
		http.post<SlideSessionResType>(
			'/auth/refresh',
			{ accessToken },
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				credentials: 'include',
			}
		),

	slideSessionFromNextClientToNextServer: () =>
		http.post<SlideSessionResType>(
			'/api/auth/refresh-token',
			{},
			{ baseUrl: '' }
		),

	getMyInfo: (username?: string, token?: string) => {
		const query = username ? `?username=${encodeURIComponent(username)}` : '';
		return http.get<MyInfoResType>(`/v1/auth/me${query}`, {
			token,
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
			cache: 'no-store',
		});
	},
};

export default authApiRequest;
