import envConfig from '@/config';
import { normalizePath } from '@/lib/utils';
import { LoginResType } from '@/schemaValidations/auth.schema';
import { redirect } from 'next/navigation';

type CustomOptions = Omit<RequestInit, 'method'> & {
	baseUrl?: string | undefined;
	token?: string | undefined;
	responseType?: 'json' | 'blob' | 'text';
};

const ENTITY_ERROR_STATUS = 422;
const AUTHENTICATION_ERROR_STATUS = 401;

type EntityErrorPayload = {
	message: string;
	errors: {
		field: string;
		message: string;
	}[];
	[key: string]: any;
};

export class HttpError extends Error {
	status: number;
	payload: {
		message: string;
		[key: string]: any;
	};
	constructor({ status, payload }: { status: number; payload: any }) {
		const message = payload?.message || 'Http Error';
		super(message);
		this.status = status;
		this.payload = payload;
	}
}

export class EntityError extends HttpError {
	status: 422;
	payload: EntityErrorPayload;
	constructor({
		status,
		payload,
	}: {
		status: 422;
		payload: EntityErrorPayload;
	}) {
		super({ status, payload });
		this.status = status;
		this.payload = payload;
	}
}

let clientLogoutRequest: null | Promise<any> = null;
export const isClient = () => typeof window !== 'undefined';

const request = async <Response>(
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
	url: string,
	options?: CustomOptions | undefined
) => {
	let body: FormData | string | undefined = undefined;

	if (options?.body instanceof FormData) {
		body = options.body;
	} else if (options?.body !== undefined) {
		body = JSON.stringify(options.body);
	}

	const baseHeaders: {
		[key: string]: string;
	} =
		body instanceof FormData
			? {}
			: {
					'Content-Type': 'application/json',
			  };

	// Client-side auto-attach authorization header
	if (isClient()) {
		const accessToken = localStorage.getItem('accessToken');
		if (accessToken) {
			baseHeaders.Authorization = `Bearer ${accessToken}`;
		}
	} else if (options?.token) {
		baseHeaders.Authorization = `Bearer ${options.token}`;
	}

	// Base URL resolution
	// If options?.baseUrl is empty string '', points to Next.js internal server routes
	const baseUrl =
		options?.baseUrl === undefined
			? envConfig.NEXT_PUBLIC_API_ENDPOINT
			: options.baseUrl;

	const cleanUrl = url.startsWith('/') ? url : `/${url}`;
	const fullUrl = baseUrl ? `${baseUrl}${cleanUrl}` : cleanUrl;

	const res = await fetch(fullUrl, {
		...options,
		headers: {
			...baseHeaders,
			...options?.headers,
		} as any,
		body,
		method,
	});

	let payload: any;
	if (options?.responseType === 'blob') {
		payload = await res.blob();
	} else if (options?.responseType === 'text') {
		payload = await res.text();
	} else {
		const contentType = res.headers.get('content-type');
		if (contentType && contentType.includes('application/json')) {
			payload = await res.json();
		} else if (res.status === 204) {
			payload = null;
		} else {
			payload = await res.text();
		}
	}

	const data = {
		status: res.status,
		payload: payload as Response,
	};

	// Interceptor handles error status codes
	if (!res.ok) {
		if (res.status === ENTITY_ERROR_STATUS) {
			throw new EntityError(
				data as {
					status: 422;
					payload: EntityErrorPayload;
				}
			);
		} else if (res.status === AUTHENTICATION_ERROR_STATUS) {
			if (isClient()) {
				const isAlreadyOnAuthPage =
					location.pathname === '/login' || location.pathname === '/register';

				if (!clientLogoutRequest) {
					clientLogoutRequest = fetch('/api/auth/logout', {
						method: 'POST',
						body: JSON.stringify({ force: true }),
						headers: { ...baseHeaders } as any,
					});

					try {
						await clientLogoutRequest;
					} catch (error) {
					} finally {
						localStorage.removeItem('accessToken');
						localStorage.removeItem('jwtAccessTokenExpiredAt');
						localStorage.removeItem('user');
						clientLogoutRequest = null;
						if (!isAlreadyOnAuthPage) {
							location.href = '/login';
						}
					}
				}
			} else {
				const authHeader = (options?.headers as any)?.Authorization || baseHeaders.Authorization;
				const accessToken = authHeader?.split('Bearer ')[1] || '';
				redirect(`/logout?accessToken=${accessToken}`);
			}
		} else {
			throw new HttpError(data);
		}
	}

	// Client-side authentication persistence
	if (isClient()) {
		const normalized = normalizePath(url).toLowerCase();
		if (normalized.includes('auth/login') || normalized.includes('auth/register')) {
			const resData = (payload as any)?.data;
			if (resData?.token) {
				localStorage.setItem('accessToken', resData.token);
				if (resData.expiresAt) {
					localStorage.setItem('jwtAccessTokenExpiredAt', resData.expiresAt);
				}
			}
		} else if (normalized.includes('auth/logout')) {
			localStorage.removeItem('accessToken');
			localStorage.removeItem('jwtAccessTokenExpiredAt');
			localStorage.removeItem('user');
		}
	}

	return data;
};

const http = {
	get<Response>(
		url: string,
		options?: Omit<CustomOptions, 'body'> | undefined
	) {
		return request<Response>('GET', url, options);
	},
	post<Response>(
		url: string,
		body?: any,
		options?: Omit<CustomOptions, 'body'> | undefined
	) {
		return request<Response>('POST', url, { ...options, body });
	},
	put<Response>(
		url: string,
		body?: any,
		options?: Omit<CustomOptions, 'body'> | undefined
	) {
		return request<Response>('PUT', url, { ...options, body });
	},
	delete<Response>(
		url: string,
		body?: any,
		options?: Omit<CustomOptions, 'body'> | undefined
	) {
		return request<Response>('DELETE', url, { ...options, body });
	},
};

export default http;
