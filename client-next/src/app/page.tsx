import Header from '@/components/header/header';
import LopChuNhiemHomePage from './components/lop-chu-nhiem';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
	return (
		<div className='h-screen w-full overflow-y-auto overflow-x-hidden'>
			<Header />
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4'>
				<div>
					<Card className='p-4 mb-4'>
						<CardContent>
							<h3 className='text-lg font-bold mb-2'>Sổ đầu bài</h3>
							<p className='text-sm text-gray-500'>
								Quản lý nội dung giảng dạy của lớp học.
							</p>
							<Link href='/sodaubai' passHref>
								<Button className='bg-blue-700 mt-3 w-full capitalize'>
									đi đến sổ đầu bài
								</Button>
							</Link>
						</CardContent>
					</Card>
					<Card className='p-4 mb-4'>
						<CardContent>
							<h3 className='text-lg font-bold mb-2'>Điểm danh</h3>
							<p className='text-sm text-gray-500'>
								Quản lý điểm danh học sinh của lớp học.
							</p>
							<Link href='/rollcall' passHref>
								<Button className='bg-blue-700 mt-3 w-full capitalize'>
									điểm danh
								</Button>
							</Link>
						</CardContent>
					</Card>
					<Card className='p-4 mb-4'>
						<CardContent>
							<h3 className='text-lg font-bold mb-2'>
								Thống kê điểm sổ đầu bài
							</h3>
							<p className='text-sm text-gray-500'>
								Quản lý điểm tiết học của lớp học.
							</p>
							<Link href='/statistics' passHref>
								<Button className='bg-blue-700 mt-3 w-full capitalize'>
									Thống kê
								</Button>
							</Link>
						</CardContent>
					</Card>
				</div>
				<div>
					<LopChuNhiemHomePage />
				</div>
			</div>
		</div>
	);
}
