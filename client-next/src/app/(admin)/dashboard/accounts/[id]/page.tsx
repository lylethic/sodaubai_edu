import accountApiRequest from '@/apiRequests/account';
import envConfig from '@/config';
import { Metadata, ResolvingMetadata } from 'next';
import { cache } from 'react';
import { baseOpenGraph } from '@/app/shared-metadata';
import { cookies } from 'next/headers';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Check, X } from 'lucide-react';

const getDetailAccount = cache(accountApiRequest.getAccountHasName);

type Props = {
	params: { id: string };
	searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
	{ params, searchParams }: Props,
	parent: ResolvingMetadata
): Promise<Metadata> {
	const cookieStore = cookies();
	const accessToken = cookieStore.get('accessToken')!.value;
	const { payload } = await getDetailAccount(Number(params.id), accessToken);

	const account = payload.data;
	const url =
		envConfig.NEXT_PUBLIC_URL + '/dashboard/accounts/' + account.accountId;
	return {
		title: account.email,
		openGraph: {
			...baseOpenGraph,
			title: account.email,
			url,
		},
		alternates: {
			canonical: url,
		},
	};
}

export default async function AccountDetail({ params, searchParams }: Props) {
	const cookieStore = cookies();
	const accessToken = cookieStore.get('accessToken');
	if (!accessToken) {
		return Response.json(
			{ message: 'Invalid accessToken' },
			{
				status: 400,
			}
		);
	}

	let account = null;
	try {
		const { payload } = await getDetailAccount(
			Number(params.id),
			accessToken.value
		);
		account = payload.data;
	} catch (error) {}

	return (
		<div className='flex flex-col items-center justify-center p-4 overflow-x-auto border mb-4'>
			<h1 className='flex items-center h-[40px] my-4 text-lg uppercase font-bold'>
				Chi tiết tài khoản
			</h1>
			<Link title='Back' href={'/dashboard/accounts'}>
				<Button title='Back' type='button' variant={'default'} className='my-4'>
					<ArrowLeft />
				</Button>
			</Link>
			{!account && <div>Không tìm thấy tài khoản</div>}
			{account && (
				<Table className='min-w-fullrounded-lg shadow'>
					<TableBody>
						<TableRow>
							<TableCell>Email</TableCell>
							<TableCell>{account.email}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Họ và tên</TableCell>
							<TableCell>{account.fullName}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Mã vai trò</TableCell>
							<TableCell>{account.roleId}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Mã trường học</TableCell>
							<TableCell>{account.schoolId}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Mã giáo viên</TableCell>
							<TableCell>{account.teacherId}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Trạng thái</TableCell>
							<TableCell>
								{account.statusTeacher ? (
									<Button className='bg-green-500'>
										Hoạt động <Check />
									</Button>
								) : (
									<Button className='bg-gray-500'>
										Ngưng hoạt động <X />
									</Button>
								)}
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			)}
		</div>
	);
}
