'use client';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useAppContext } from '../app-provider';
import { formatDateToDDMMYYYY, handleErrorApi } from '@/lib/utils';
import teacherApiRequest from '@/apiRequests/teacher';
import { LopHocResType } from '@/schemaValidations/lopHoc.shema';
import { lopHocApiRequest } from '@/apiRequests/lopHoc';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Form, FormProvider } from 'react-hook-form';

export default function LopChuNhiemHomePage() {
	const { user } = useAppContext();
	const accountId = user?.accountId;
	const [loading, setLoading] = useState(false);
	const [teacherId, setTeacherId] = useState<number>(0);
	const [classDetail, setClassDetail] = useState<LopHocResType['data']>();

	const fetchTeacherAndClass = async () => {
		if (!accountId) return;
		setLoading(true);
		try {
			// Step 1: Fetch teacherId
			const { payload } = await teacherApiRequest.teacherByAccountId(
				Number(accountId)
			);
			const teacherId = payload.data.teacherId;
			setTeacherId(teacherId);

			// Step 2: Fetch class details using teacherId
			if (teacherId) {
				const lopChuNhiemData = await lopHocApiRequest.lopChuNhiem(teacherId);
				setClassDetail(lopChuNhiemData.payload.data);
			}
		} catch (error) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		if (loading) return;
		fetchTeacherAndClass();
	}, [accountId]);

	return (
		<>
			{classDetail ? (
				<Card className='p-4 w-full max-w-lg mx-auto'>
					<CardContent>
						<h2 className='text-lg font-bold mb-4 capitalize'>
							Thông Tin Lớp chủ nhiệm
						</h2>
						{loading ? (
							<p className='text-center'>Đang tải...</p>
						) : (
							<form className='space-y-3'>
								<Input
									type='text'
									name='className'
									placeholder='Tên lớp chủ nhiệm...'
									value={classDetail?.className}
								/>

								<Input
									type='text'
									name='gradeName'
									value={classDetail?.gradeName ?? ''}
								/>
								<Input
									type='text'
									name='teacherName'
									value={classDetail?.teacherName ?? ''}
								/>
								<Input
									type='text'
									name='schoolName'
									value={classDetail?.schoolName ?? ''}
								/>
								<Input
									type='text'
									name='nienKhoa'
									value={classDetail?.nienKhoa ?? ''}
								/>
								<div className='flex items-center justify-end'>
									<Checkbox
										name='status'
										checked={classDetail?.status ?? false}
										className='mr-2'
									>
										Hoạt động
									</Checkbox>
									<Input
										type='text'
										name='nienKhoa'
										value={
											classDetail?.status ? 'Hoạt động' : 'Ngưng hoạt động'
										}
									/>
								</div>
								<Textarea
									name='description'
									value={classDetail?.description ?? ''}
								/>
								{/* <Input
									type='text'
									name='dateCreated'
									value={formatDateToDDMMYYYY(classDetail?.dateCreated ?? null)}
								/>
								<Input
									type='text'
									name='dateUpdated'
									value={formatDateToDDMMYYYY(classDetail?.dateUpdated ?? null)}
								/> */}
							</form>
						)}
					</CardContent>
				</Card>
			) : (
				<span>Không có lớp chủ nhiệm</span>
			)}
		</>
	);
}
