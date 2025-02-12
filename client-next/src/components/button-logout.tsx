'use client';

import authApiRequest from '@/apiRequests/auth';
import { useAppContext } from '@/app/app-provider';
import { Button } from '@/components/ui/button';
import { handleErrorApi } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { DropdownMenuShortcut } from '@/components/ui/dropdown-menu';

export default function ButtonLogout() {
	const { setUser } = useAppContext();
	const router = useRouter();
	const pathname = usePathname();
	const handleLogout = async () => {
		try {
			await authApiRequest.logoutFromNextClientToNextServer();
			router.push('/login');
		} catch (error) {
			handleErrorApi({
				error,
			});
			authApiRequest.logoutFromNextClientToNextServer(true).then((res) => {
				router.push(`/login?redirectFrom=${pathname}`);
			});
		} finally {
			setUser(null);
			router.refresh();
			localStorage.removeItem('accessToken');
			localStorage.removeItem('jwtAccessTokenExpiredAt');
			localStorage.removeItem('user');
		}
	};
	return (
		<Button size={'sm'} onClick={handleLogout} className='w-full text-sm'>
			Đăng xuất
			<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
		</Button>
	);
}
