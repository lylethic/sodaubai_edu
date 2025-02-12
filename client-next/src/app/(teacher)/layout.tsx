import Header from '@/components/header/header';
import React from 'react';

export default function TeacherLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className='h-screen w-full overflow-y-auto overflow-x-hidden'>
			<Header />
			<main className='p-6'>
				<div>{children}</div>
			</main>
		</div>
	);
}
