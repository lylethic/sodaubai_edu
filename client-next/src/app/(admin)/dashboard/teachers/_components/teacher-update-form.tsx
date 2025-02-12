'use client';

import React, { Suspense, useRef, useState } from 'react';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { handleErrorApi } from '@/lib/utils';
import {
	UpdateTeacherBody,
	UpdateTeacherBodyType,
} from '@/schemaValidations/teacher.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Form, FormProvider, useForm } from 'react-hook-form';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import SchoolSelect from '../../../_components/school-select';
import { Button } from '@/components/ui/button';
import teacherApiRequest from '@/apiRequests/teacher';
import { ArrowLeft, ArrowRight, Images } from 'lucide-react';
import LoadingSpinner from '../../loading';
import Image from 'next/image';

type Props = {
	params: { id: string };
	teacher: UpdateTeacherBodyType;
};

export default function TeacherUpdateForm({ params, teacher }: Props) {
	const [file, setFile] = useState<File | null>(null);

	const inputRef = useRef<HTMLInputElement | null>(null);
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<UpdateTeacherBodyType>({
		resolver: zodResolver(UpdateTeacherBody),
		defaultValues: {
			teacherId: teacher?.teacherId ?? 0,
			accountId: teacher?.accountId ?? 0,
			schoolId: teacher?.schoolId ?? 0,
			fullname: teacher?.fullname,
			dateOfBirth: teacher?.dateOfBirth,
			gender: teacher?.gender,
			address: teacher?.address,
			status: teacher?.status,
			dateCreate: teacher?.dateCreate,
			dateUpdate: teacher?.dateUpdate,
			photoPath: teacher?.photoPath,
		},
	});

	if (!teacher) {
		return <div>Không tìm thấy giáo viên</div>;
	}

	const updateTeacher = async (data: UpdateTeacherBodyType) => {
		setLoading(true);
		try {
			const result = await teacherApiRequest.update(Number(params.id), {
				teacherId: data.teacherId,
				accountId: data.accountId,
				schoolId: data.schoolId,
				fullname: data.fullname,
				dateOfBirth: new Date(data.dateOfBirth),
				gender: data.gender,
				address: data.address,
				status: data.status,
				photoPath: data.photoPath,
			});
			toast({
				title: 'Thông báo!',
				description: result.payload.message,
			});
			router.refresh();
		} catch (error: any) {
			handleErrorApi({ error, setError: form.setError });
		} finally {
			setLoading(false);
		}
	};

	async function onSubmit(values: UpdateTeacherBodyType) {
		if (loading) return;
		await updateTeacher(values);
	}

	return (
		<Suspense fallback={<LoadingSpinner />}>
			<div className='w-full my-2 flex flex-col items-center'>
				<div className='flex justify-center items-center my-4'>
					<Button
						variant={'default'}
						onClick={() => router.push('/sodaubai')}
						title='Quay về'
					>
						<ArrowLeft />
						Trang chủ
					</Button>
				</div>
				<FormProvider {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit, (error) => {
							console.log(error);
						})}
						className='grid grid-cols-1 lg:grid-cols-2 gap-6 text-lg w-full max-w-5xl lg:border lg:rounded-xl lg:p-4'
						noValidate
					>
						<div className='flex flex-col items-center space-y-4'>
							<FormField
								control={form.control}
								name='photoPath'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Ảnh đại diện</FormLabel>
										<FormControl>
											<div className='flex flex-col justify-center gap-2'>
												{file ? (
													<div className='w-32 h-32 rounded-[50%] overflow-hidden border'>
														<Image
															src={URL.createObjectURL(file)}
															className='object-cover'
															placeholder='empty'
															alt={`Ảnh của giáo viên ${teacher.fullname}`}
															width={128}
															height={128}
															layout='responsive'
															loading='lazy'
														/>
													</div>
												) : (
													<div className='flex items-center justify-center w-32 h-32 rounded-[50%] overflow-hidden border'>
														<Image
															src={
																teacher.photoPath instanceof File
																	? URL.createObjectURL(teacher.photoPath)
																	: teacher.photoPath ?? ''
															}
															className='object-cover'
															placeholder='empty'
															alt={`Ảnh của giáo viên ${teacher.fullname}`}
															width={128}
															height={128}
															loading='lazy'
														/>
													</div>
												)}
												<Input
													type='file'
													ref={inputRef}
													accept='image/*'
													className='hidden'
													onChange={(e) => {
														if (e.target.files && e.target.files[0]) {
															setFile(e.target.files[0]);
															field.onChange(e.target.files[0]);
														}
													}}
												/>
												<Button
													type='button'
													className='w-32'
													onClick={() => inputRef.current?.click()}
												>
													Chọn ảnh
												</Button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						{/* Form Fields Section */}
						<div className='flex flex-col space-y-4'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<FormField
									control={form.control}
									name='teacherId'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Mã giáo viên</FormLabel>
											<FormControl>
												<Input
													type='number'
													placeholder='Nhập mã giáo viên...'
													{...field}
													value={
														field.value !== undefined
															? field.value.toString()
															: ''
													}
													onChange={(e) =>
														field.onChange(
															e.target.value
																? Number(e.target.value)
																: undefined
														)
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='accountId'
									render={({ field }) => (
										<FormItem aria-readonly>
											<FormLabel>Chọn tài khoản</FormLabel>
											<FormControl>
												<Input
													placeholder='Nhập mã tài khoản...'
													type='number'
													{...field}
													value={
														field.value !== undefined
															? field.value.toString()
															: ''
													}
													onChange={(e) =>
														field.onChange(
															e.target.value
																? Number(e.target.value)
																: undefined
														)
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<FormField
								control={form.control}
								name='schoolId'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Trường học</FormLabel>
										<SchoolSelect
											selectedSchoolId={field.value}
											onSelectSchool={(schoolId) => field.onChange(schoolId)}
										/>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='fullname'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Họ và tên...</FormLabel>
										<FormControl>
											<Input
												placeholder='Nhập họ và tên'
												type='text'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<FormField
									control={form.control}
									name='dateOfBirth'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Ngày sinh</FormLabel>
											<FormControl>
												<Input
													placeholder='Ngày sinh'
													type='date'
													{...field}
													value={
														field.value
															? new Date(field.value).toLocaleDateString(
																	'en-CA'
															  )
															: ''
													}
													onChange={(e) =>
														field.onChange(
															e.target.value
																? new Date(e.target.value)
																: undefined
														)
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='gender'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Giới tính</FormLabel>
											<Select
												value={
													field.value !== undefined
														? field.value
															? '1'
															: '0'
														: ''
												}
												onValueChange={(value) => field.onChange(value === '1')}
											>
												<SelectTrigger className='w-[180px]'>
													<SelectValue placeholder='Chọn giới tính' />
												</SelectTrigger>
												<SelectContent>
													<SelectGroup>
														<SelectLabel>Giới tính</SelectLabel>
														<SelectItem value='1'>Nam</SelectItem>
														<SelectItem value='0'>Nữ</SelectItem>
													</SelectGroup>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<FormField
								control={form.control}
								name='address'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Địa chỉ</FormLabel>
										<FormControl>
											<Textarea
												placeholder='Nhập địa chỉ'
												{...field}
												className='resize-none'
												rows={5}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='status'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Trạng thái hoạt động</FormLabel>
										<Select
											value={
												field.value !== undefined
													? field.value
														? '1'
														: '0'
													: ''
											}
											onValueChange={(value) => field.onChange(value === '1')}
										>
											<SelectTrigger className='w-[180px]'>
												<SelectValue placeholder='Chọn trạng thái' />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													<SelectLabel>Trạng thái hoạt động</SelectLabel>
													<SelectItem value='1'>Hoạt động</SelectItem>
													<SelectItem value='0'>Không</SelectItem>
												</SelectGroup>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<FormField
									control={form.control}
									name='dateCreate'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Ngày tạo</FormLabel>
											<FormControl>
												<Input
													placeholder='Ngày tạo'
													type='date'
													{...field}
													readOnly
													disabled
													value={
														field.value
															? new Date(field.value).toLocaleDateString(
																	'en-CA'
															  )
															: ''
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='dateUpdate'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Thời gian cập nhật gần đây</FormLabel>
											<FormControl>
												<Input
													placeholder='Cập nhật'
													type='date'
													readOnly
													disabled
													{...field}
													value={
														field.value
															? new Date(field.value).toLocaleDateString(
																	'en-CA'
															  )
															: ''
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
						<Button type='submit' className='bg-blue-700 !mt-8 w-full'>
							{loading ? 'Vui lòng chờ xử lý...' : 'Cập nhật'}
						</Button>
					</form>
				</FormProvider>
			</div>
		</Suspense>
	);
}
