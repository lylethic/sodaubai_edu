import { cache } from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { cookies } from 'next/headers';
import envConfig from '@/config';
import { baseOpenGraph } from '@/app/shared-metadata';
import teacherApiRequest from '@/apiRequests/teacher';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check, Images } from 'lucide-react';
import Image from 'next/image';

const getDetailTeacher = cache(teacherApiRequest.teacherDetail);

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
	const { payload } = await getDetailTeacher(Number(params.id), accessToken);

	const teacher = payload.data;
	const url =
		envConfig.NEXT_PUBLIC_URL + '/dashboard/teachers/' + teacher.teacherId;
	return {
		title: teacher.fullname,
		openGraph: {
			...baseOpenGraph,
			title: teacher.fullname,
			url,
		},
		alternates: {
			canonical: url,
		},
	};
}

export default async function TeacherDetail({ params, searchParams }: Props) {
	const cookieStore = cookies();
	const token = cookieStore.get('accessToken');
	if (!token) return;

	let result = null;
	try {
		const { payload } = await getDetailTeacher(Number(params.id), token.value);
		result = payload.data;
	} catch (error) {}

	return (
		<div>
			{!result && <div>Không có kết quả</div>}
			{result && (
				<div className='overflow-x-auto border p-4 w-full'>
					<h1 className='text-center mt-4 text-lg uppercase font-bold'>
						Chi tiết giáo viên
					</h1>
					<div className='flex items-center justify-center'>
						<Link
							href={'/dashboard/teachers'}
							className='flex justify-center items-center my-4'
						>
							<Button variant={'default'} type='button' title='Quay về'>
								<ArrowLeft />
							</Button>
						</Link>
						<Link href={`/dashboard/teachers/${result.teacherId}/edit`}>
							<Button
								variant={'outline'}
								type='button'
								title='Chỉnh sửa'
								className='bg-yellow-400 text-black ms-2'
							>
								Chỉnh sửa
								<ArrowRight />
							</Button>
						</Link>
					</div>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4 '>
						<div className='flex flex-col space-y-4'>
							<Table className='min-w-fullrounded-lg shadow'>
								<TableBody>
									<TableRow></TableRow>
									<TableRow>
										<TableCell>Mã giáo viên</TableCell>
										<TableCell>{result.teacherId}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>Mã tài khoản</TableCell>
										<TableCell>{result.accountId}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>Mã trường học</TableCell>
										<TableCell>{result.schoolId}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>Họ và tên</TableCell>
										<TableCell>{result.fullname}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>Ngày sinh</TableCell>
										<TableCell>{result.dateOfBirth}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>Giới tính</TableCell>
										<TableCell>{result.gender ? 'Nam' : 'Nữ'}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>Địa chỉ hiện tại</TableCell>
										<TableCell>{result.address}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>Trạng thái</TableCell>
										<TableCell>
											{result.status ? (
												<Button
													aria-readonly
													className='flex bg-green-500 text-white'
												>
													<Check /> Hoạt động
												</Button>
											) : (
												'Ngưng hoạt động'
											)}
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>Ngày tạo</TableCell>
										<TableCell>{result.dateCreate}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>Ngày cập nhật</TableCell>
										<TableCell>{result.dateUpdate}</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</div>
						<div className='flex flex-col space-y-4 lg:ml-6'>
							<span className='font-medium'>Ảnh đại diện</span>
							<div className='flex items-center justify-center w-32 h-32 rounded-[50%] overflow-hidden border'>
								{result.photoPath ? (
									<Image
										src={result.photoPath ?? ''}
										className='object-contain'
										alt={`Ảnh của giáo viên ${result.fullname}`}
										width={128}
										height={128}
										layout='responsive'
										loading='lazy'
									/>
								) : (
									<Images size={50} />
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
