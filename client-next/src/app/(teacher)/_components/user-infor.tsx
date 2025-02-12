'use client';

import React, { useEffect, useState } from 'react';
import teacherApiRequest from '@/apiRequests/teacher';
import Image from 'next/image';
import { useAppContext } from '../../app-provider';
import Link from 'next/link';
import { handleErrorApi } from '@/lib/utils';
import { TeacherResType } from '@/schemaValidations/teacher.schema';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { ArrowLeft, ArrowRight, Check, Images } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MeProfile() {
	const [information, setInformation] = useState<TeacherResType['data']>();
	const [loading, setLoading] = useState(false);

	const { user } = useAppContext();
	const accountId = Number(user?.accountId);
	useEffect(() => {
		const fetchInformation = async () => {
			setLoading(true);
			try {
				const { payload } = await teacherApiRequest.teacherByAccountId(
					accountId
				);
				setInformation(payload.data);
			} catch (error) {
				handleErrorApi({ error });
			} finally {
				setLoading(false);
			}
		};

		if (!loading && user) {
			fetchInformation();
		}
	}, [user]);

	return (
		<>
			<div className='flex items-center justify-center'>
				<Link
					href={'/sodaubai'}
					className='flex justify-center items-center my-4'
				>
					<Button variant={'default'} type='button' title='Quay về trang chủ'>
						<ArrowLeft />
						Trang chủ
					</Button>
				</Link>
				<Link href={`/me/${information?.teacherId}`}>
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
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<div className='flex flex-col items-end space-y-4 lg:ml-6 w-2/3'>
					<span className='font-medium'>Ảnh đại diện</span>
					<div className='flex items-center justify-center w-32 h-32 rounded-[50%] overflow-hidden border'>
						{information?.photoPath ? (
							<Image
								src={information?.photoPath ?? ''}
								className='object-contain'
								alt={`Ảnh của giáo viên ${information?.fullname}`}
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
				<div className='flex flex-col space-y-4 w-2/3'>
					<Table className='min-w-fullrounded-lg shadow'>
						<TableBody>
							<TableRow></TableRow>
							<TableRow>
								<TableCell>Mã giáo viên</TableCell>
								<TableCell>{information?.teacherId}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Mã tài khoản</TableCell>
								<TableCell>{information?.accountId}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Mã trường học</TableCell>
								<TableCell>{information?.schoolId}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Họ và tên</TableCell>
								<TableCell>{information?.fullname}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Ngày sinh</TableCell>
								<TableCell>
									{information?.dateOfBirth
										? new Date(information?.dateOfBirth).toLocaleDateString(
												'en-CA'
										  )
										: null}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Giới tính</TableCell>
								<TableCell>{information?.gender ? 'Nam' : 'Nữ'}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Địa chỉ hiện tại</TableCell>
								<TableCell>{information?.address}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Trạng thái</TableCell>
								<TableCell>
									{information?.status ? (
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
						</TableBody>
					</Table>
				</div>
			</div>
		</>
	);
}
