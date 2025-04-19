import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeJWT } from './lib/utils';

//
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

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
	const requestHeaders = new Headers(request.headers);
	requestHeaders.set('x-next-pathname', request.nextUrl.pathname);

	const { pathname } = request.nextUrl;
	const accessToken = request.cookies.get('accessToken')?.value;

	const decodeToken = decodeJWT(accessToken!);
	const role = decodeToken?.RoleId ? Number(decodeToken.RoleId) : null;

	// If already on an auth path, don't redirect again
	const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

	// Chưa đăng nhập thì không cho vào private paths
	if (!accessToken) {
		// Don't redirect if already on an auth path
		if (
			!isAuthPath &&
			(teacherPaths.some((path) => pathname.startsWith(path)) ||
				adminPaths.some((path) => pathname.startsWith(path)))
		) {
			return NextResponse.redirect(new URL('/login', request.url));
		}
	}

	// Đăng nhập rồi thì không cho vào login/register nữa
	if (accessToken && isAuthPath) {
		// Redirect based on role
		if (role === 2) {
			return NextResponse.redirect(new URL('/sodaubai', request.url));
		} else if (role === 6 || role === 7) {
			return NextResponse.redirect(new URL('/dashboard', request.url));
		}
		// If no specific role or other role, redirect to home
		return NextResponse.redirect(new URL('/', request.url));
	}

	// Role-based access control
	if (accessToken) {
		// teacher allowed
		if (role === 2 && adminPaths.some((path) => pathname.startsWith(path))) {
			return NextResponse.redirect(new URL('/sodaubai', request.url));
		}

		// admin allowed
		if (
			(role === 6 || role === 7) &&
			teacherPaths.some((path) => pathname.startsWith(path))
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

// Fixed matcher to include the root path
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
