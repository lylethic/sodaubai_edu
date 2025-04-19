import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeJWT } from './lib/utils';

const authPaths = ['/login', '/register'];

const teacherPaths = [
	'/',
	'/sodaubai',
	'/statistics',
	'/rollcall',
	'/sodaubai/chitietsodaubai/:id*',
	'/report',
];

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

const isPathMatch = (pathname: string, paths: string[]) =>
	paths.some((path) => pathname.startsWith(path));

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const accessToken = request.cookies.get('accessToken')?.value;
	const requestHeaders = new Headers(request.headers);
	requestHeaders.set('x-next-pathname', pathname);

	const isAuthPath = isPathMatch(pathname, authPaths);
	const isTeacherPath = isPathMatch(pathname, teacherPaths);
	const isAdminPath = isPathMatch(pathname, adminPaths);

	const decodeToken = accessToken ? decodeJWT(accessToken) : null;
	const role = decodeToken?.RoleId ? Number(decodeToken.RoleId) : null;

	// 🛑 Chưa đăng nhập và truy cập private path
	if (!accessToken && (isTeacherPath || isAdminPath)) {
		if (!isAuthPath) {
			return NextResponse.redirect(new URL('/login', request.url));
		}
	}

	// ✅ Đã đăng nhập mà vào login/register → redirect theo role
	if (accessToken && isAuthPath) {
		if (role === 2 && pathname !== '/sodaubai') {
			return NextResponse.redirect(new URL('/sodaubai', request.url));
		}
		if ((role === 6 || role === 7) && pathname !== '/dashboard') {
			return NextResponse.redirect(new URL('/dashboard', request.url));
		}
		if (pathname !== '/') {
			return NextResponse.redirect(new URL('/', request.url));
		}
	}

	// 🛡️ Kiểm soát role-based access
	if (accessToken) {
		// Teacher không được vào admin pages
		if (role === 2 && isAdminPath && pathname !== '/sodaubai') {
			return NextResponse.redirect(new URL('/sodaubai', request.url));
		}

		// Admin không được vào teacher pages
		if (
			(role === 6 || role === 7) &&
			isTeacherPath &&
			!pathname.startsWith('/dashboard')
		) {
			return NextResponse.redirect(new URL('/dashboard', request.url));
		}
	}

	return NextResponse.next({
		request: {
			headers: requestHeaders,
		},
	});
}

export const config = {
	matcher: [
		'/',
		'/sodaubai',
		'/statistics',
		'/login',
		'/register',
		'/dashboard',
		'/dashboard/:path*',
		'/report',
		'/sodaubai/chitietsodaubai/:id*',
		'/rollcall',
	],
};
