import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import AppProvider from './app-provider';
import RefreshToken from '@/components/refresh-token';
import { Suspense } from 'react';
import LoadingSpinner from './(admin)/dashboard/loading';
import './globals.css';

const inter = Inter({ subsets: ['vietnamese'] });

export const metadata: Metadata = {
	title: {
		template: '%s | Sổ đầu bài điện tử',
		default: 'Sổ đầu bài điện tử',
	},
	description: 'Được tạo bởi Lylethic',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={`${inter.className}`}>
				<Toaster />
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem
					disableTransitionOnChange
				>
					<AppProvider>
						<Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
						<RefreshToken />
					</AppProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
