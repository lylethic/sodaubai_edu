import React from 'react';
import TeacherStatisticsList from './_components/statistic-list';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function StatisticsPage() {
	return (
		<>
			<Link href='/'>
				<Button
					type='button'
					variant={'default'}
					className='bg-blue-700 text-white capitalize'
				>
					<Home />
					trang chủ
				</Button>
			</Link>
			<h1 className='text-lg font-medium my-2 text-center uppercase'>
				Thống kế điểm các tiết học của sổ đầu bài
			</h1>
			<TeacherStatisticsList />
		</>
	);
}
