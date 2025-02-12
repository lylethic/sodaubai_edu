import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeJWT } from './lib/utils';

//
const authPaths = ['/login', '/register'];
const teacherPaths = ['/sodaubai', '/sodaubai/chitietsodaubai/:id*', '/report'];
const adminPaths = [
	'/dashboard',
	'/dashboard/accounts',
	'/dashboard/notify',
	'/dashboard/reports',
	'/dashboard/thongke',
	'/dashboard/teachers',
	'/dashboard/students',
	'/dashboard/classes',
	'/dashboard/sodaubais',
	'/dashboard/chitietsodaubai',
	'/dashboard/semesters',
	'/dashboard/school-years',
	'/dashboard/weeks',
	'/dashboard/schools',
	'/dashboard/subjects',
	'/dashboard/xep-loai-tiet-hoc',
];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
	const requestHeaders = new Headers(request.headers);
	requestHeaders.set('x-next-pathname', request.nextUrl.pathname);

	const { pathname } = request.nextUrl;
	const accessToken = request.cookies.get('accessToken')?.value;

	const decodeToken = decodeJWT(accessToken!);
	const role = decodeToken?.RoleId ? Number(decodeToken.RoleId) : null;

	// Chưa đăng nhập thì không cho vào private paths
	if (!accessToken) {
		if (
			teacherPaths.some((path) => pathname.startsWith(path)) ||
			adminPaths.some((path) => pathname.startsWith(path))
		) {
			return NextResponse.redirect(new URL('/login', request.url));
		}
	}

	// Đăng nhập rồi thì không cho vào login/register nữa
	if (authPaths.some((path) => pathname.startsWith(path)) && accessToken) {
		return NextResponse.redirect(new URL('/sodaubai', request.url));
	}

	// teacher allowed
	if (role === 2) {
		if (adminPaths.some((path) => pathname.startsWith(path))) {
			return NextResponse.redirect(new URL('/sodaubai', request.url));
		}
	}

	// admin allowed
	if (role === 6 || role === 7) {
		if (teacherPaths.some((path) => pathname.startsWith(path))) {
			return NextResponse.redirect(new URL('/dashboard', request.url));
		}
	}

	return NextResponse.next({
		request: {
			headers: requestHeaders,
		},
	});
}

// See "Matching Paths" below to learn more
export const config = {
	matcher: [
		'/sodaubai',
		'/login',
		'/register',
		'/dashboard',
		'/dashboard/:path*',
		'/report',
		'/sodaubai/chitietsodaubai/:id*',
	],
};
