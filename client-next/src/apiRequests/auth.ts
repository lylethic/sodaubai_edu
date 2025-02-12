// import { SlideSessionBodyType } from './../../../server/src/schemaValidations/auth.schema';
import http from '@/lib/http';
import { MessageResType } from './../schemaValidations/common.schema';
import {
	LoginBodyType,
	LoginResType,
	RegisterBodyType,
	RegisterResType,
	SlideSessionResType,
} from '@/schemaValidations/auth.schema';

const authApiRequest = {
	login: (body: LoginBodyType) => http.post<LoginResType>('Auth/login', body),

	register: (body: RegisterBodyType) =>
		http.post<RegisterResType>('auth/register', body),

	auth: (body: { accessToken: string; expiresAt: string }) =>
		http.post<RegisterResType>('api/auth', body, {
			baseUrl: '', // truyen '' de goi den Next.js Server
		}),

	logoutFromNextServerToServer: (accessToken: string) =>
		http.post<MessageResType>(
			'/Auth/logout',
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
			'/Auth/refresh',
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
};

export default authApiRequest;
