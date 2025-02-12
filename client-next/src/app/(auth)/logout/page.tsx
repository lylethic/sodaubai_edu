'use client';

import React, { Suspense, useEffect } from 'react';
import authApiRequest from '@/apiRequests/auth';
import { useAppContext } from '@/app/app-provider';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

function LogoutLogic() {
	const { setUser } = useAppContext();

	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const accessToken = searchParams.get('accessToken');

	useEffect(() => {
		const controller = new AbortController();
		const signal = controller.signal;

		if (accessToken === localStorage.getItem('accessToken')) {
			authApiRequest
				.logoutFromNextClientToNextServer(true, signal)
				.then((res) => {
					setUser(null);
					router.push(`/login?redirectFrom=${pathname}`);
				})
				.catch((error) => {
					console.log(error);
				});
		}

		return () => {
			controller.abort();
		};
	}, [accessToken, router, pathname]);

	return <div>Logout</div>;
}

export default function LogoutPage() {
	return (
		<Suspense>
			<LogoutLogic />
		</Suspense>
	);
}
