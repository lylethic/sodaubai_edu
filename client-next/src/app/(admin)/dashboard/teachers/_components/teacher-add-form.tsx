'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { handleErrorApi } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import {
	CreateTeacherBody,
	CreateTeacherBodyType,
	TeacherDetailResType,
} from '@/schemaValidations/teacher.schema';
import SchoolSelect from '../../../_components/school-select';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import teacherApiRequest from '@/apiRequests/teacher';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';

type Teacher = TeacherDetailResType['data'];

export default function TeacherAddForm({ teacher }: { teacher?: Teacher }) {
	const [file, setFile] = useState<File | null>(null);

	const inputRef = useRef<HTMLInputElement | null>(null);

	const [loading, setLoading] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<CreateTeacherBodyType>({
		resolver: zodResolver(CreateTeacherBody),
		defaultValues: {
			TeacherId: teacher?.teacherId ?? 1,
			AccountId: teacher?.accountId,
			SchoolId: teacher?.schoolId,
			Fullname: teacher?.fullname,
			DateOfBirth: teacher?.dateOfBirth,
			Gender: teacher?.gender,
			Address: teacher?.address,
			Status: teacher?.status,
			DateCreate: teacher?.dateCreate,
			DateUpdate: teacher?.dateUpdate,
			PhotoPath: null,
		},
	});
	const image = form.watch('PhotoPath');

	const handleAddTeacher = async (data: CreateTeacherBodyType) => {
		setLoading(true);
		try {
			const result = await teacherApiRequest.create({
				TeacherId: data.TeacherId,
				AccountId: data.AccountId,
				SchoolId: data.SchoolId,
				Fullname: data.Fullname,
				DateOfBirth: new Date(data.DateOfBirth),
				Gender: data.Gender,
				Address: data.Address,
				Status: data.Status,
				PhotoPath: data.PhotoPath,
			});

			toast({
				description: result.payload.message,
			});

			form.reset();
		} catch (error: any) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	async function onSubmit(values: CreateTeacherBodyType) {
		if (loading) return;
		await handleAddTeacher(values);
	}

	return (
		<>
			<div className='w-full my-2'>
				<div className='flex justify-center items-center my-4'>
					<Button
						variant={'default'}
						onClick={() => router.back()}
						title='Quay về'
					>
						<ArrowLeft />
					</Button>
				</div>
			</div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit, (error) => {
						console.log(error);
					})}
					className='grid grid-cols-1 md:grid-cols-2 gap-4 text-lg border p-4 rounded-xl'
					noValidate
				>
					<div className='flex flex-col space-y-4'>
						<FormField
							control={form.control}
							name='TeacherId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Mã giáo viên</FormLabel>
									<FormControl>
										<Input
											type='number'
											placeholder='Nhập mã giáo viên...'
											{...field}
											value={
												field.value !== undefined ? field.value.toString() : ''
											}
											onChange={(e) =>
												field.onChange(
													e.target.value ? Number(e.target.value) : undefined
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
							name='AccountId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Chọn tài khoản</FormLabel>
									<FormControl>
										<Input
											type='number'
											placeholder='Nhập mã tài khoản...'
											{...field}
											value={
												field.value !== undefined ? field.value.toString() : ''
											}
											onChange={(e) =>
												field.onChange(
													e.target.value ? Number(e.target.value) : undefined
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
							name='SchoolId'
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
							name='Fullname'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Họ và tên</FormLabel>
									<FormControl>
										<Input
											type='text'
											placeholder='Nhập họ và tên'
											{...field}
											value={
												field.value !== undefined ? field.value.toString() : ''
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='DateOfBirth'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Ngày sinh</FormLabel>
									<FormControl>
										<Input
											type='date'
											placeholder='Ngày sinh'
											{...field}
											value={
												field.value
													? field.value.toISOString().split('T')[0]
													: ''
											}
											onChange={(e) => field.onChange(new Date(e.target.value))}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='Gender'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Giới tính</FormLabel>
									<Select
										value={
											field.value !== undefined ? (field.value ? '1' : '0') : ''
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
						<FormField
							control={form.control}
							name='Address'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Địa chỉ</FormLabel>
									<FormControl>
										<Textarea
											{...field}
											className='resize-none'
											rows={3}
											placeholder='Nhập địa chỉ'
											value={
												field.value !== undefined ? field.value.toString() : ''
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='Status'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Trạng thái hoạt động</FormLabel>
									<Select
										value={
											field.value !== undefined ? (field.value ? '1' : '0') : ''
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
					</div>
					<div className='flex flex-col space-y-4'>
						<FormField
							control={form.control}
							name='PhotoPath'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Ảnh đại diện</FormLabel>
									<FormControl>
										<div className='flex items-center gap-2'>
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
												onClick={() => inputRef.current?.click()}
											>
												Chọn ảnh
											</Button>
											{image && (
												<Image
													src={URL.createObjectURL(image)}
													alt='Ảnh giáo viên'
													width={150}
													height={150}
												/>
											)}
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<Button type='submit' className='!mt-8 w-full'>
						{loading ? 'Vui lòng chờ xử lý...' : 'Thêm mới'}
					</Button>
				</form>
			</Form>
		</>
	);
}
