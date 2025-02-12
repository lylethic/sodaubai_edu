'use client';

import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	AcademicYearResType,
	CreateNamHocBody,
	CreateNamHocBodyType,
	UpdateNamHocBodyType,
} from '@/schemaValidations/academicYear.schema';
import { namHocApiRequest } from '@/apiRequests/namHoc';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';

type AcademicYearType = AcademicYearResType['data'];

export default function AcademicYearUpSertForm({
	academicYear,
}: {
	academicYear?: AcademicYearType;
}) {
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<CreateNamHocBodyType>({
		resolver: zodResolver(CreateNamHocBody),
		defaultValues: {
			academicYearId: academicYear?.academicYearId ?? 0,
			displayAcademicYearName: academicYear?.displayAcademicYearName ?? '',
			yearStart: academicYear?.yearStart
				? new Date(academicYear.yearStart)
				: undefined,
			yearEnd: academicYear?.yearEnd
				? new Date(academicYear.yearEnd)
				: undefined,
			status: academicYear?.status,
			description: academicYear?.description,
		},
	});

	const handleCreate = async (values: CreateNamHocBodyType) => {
		setLoading(true);
		try {
			const response = await namHocApiRequest.create({
				...values,
				yearStart: new Date(values.yearStart),
				yearEnd: new Date(values.yearEnd),
			});

			toast({ description: response.payload.message });
			form.reset();
		} catch (error: any) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	const handleUpdate = async (_values: UpdateNamHocBodyType) => {
		if (!academicYear) return;
		setLoading(true);
		try {
			const response = await namHocApiRequest.update(
				academicYear.academicYearId,
				{
					..._values,
					yearStart: new Date(_values.yearStart),
					yearEnd: new Date(_values.yearEnd),
				}
			);

			toast({ description: response.payload.message });
			router.refresh();
		} catch (error: any) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	async function onSubmit(values: CreateNamHocBodyType) {
		if (loading) return;

		if (!academicYear) await handleCreate(values);
		else {
			await handleUpdate(values);
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit, (error) => {
					console.log(error);
				})}
				className='text-lg space-y-2 max-w-[600px] flex-shrink-0 w-full'
				noValidate
			>
				<FormField
					control={form.control}
					name='academicYearId'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Mã năm học</FormLabel>
							<FormControl>
								<Input
									type='text'
									placeholder='Mã năm học...'
									alt='Mã năm học...'
									value={field.value}
									disabled
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='displayAcademicYearName'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tên hiển thị năm học</FormLabel>
							<FormControl>
								<Input
									type='text'
									placeholder='Nhập tên hiển thị năm học...'
									alt='Nhập tên hiển thị năm học...'
									{...field}
									value={field.value || ''}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='yearStart'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Thời gian bắt đầu</FormLabel>
							<FormControl>
								<Input
									type='date'
									{...field}
									value={
										field.value
											? new Date(field.value).toISOString().split('T')[0]
											: ''
									}
									onChange={(e) =>
										field.onChange(
											e.target.value ? new Date(e.target.value) : undefined
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
					name='yearEnd'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Thời gian kết thúc</FormLabel>
							<FormControl>
								<Input
									type='date'
									{...field}
									value={
										field.value
											? new Date(field.value).toISOString().split('T')[0]
											: ''
									}
									onChange={(e) =>
										field.onChange(
											e.target.value ? new Date(e.target.value) : undefined
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
					name='description'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ghi chú</FormLabel>
							<FormControl>
								<Textarea
									className='resize-none'
									placeholder='Nhập ghi chú...'
									rows={3}
									{...field}
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
									field.value !== undefined ? (field.value ? '1' : '0') : '1'
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

				<Button type='submit' className='!mt-8 w-full'>
					{academicYear ? 'Cập nhật' : 'Thêm mới'}
				</Button>
			</form>
		</Form>
	);
}
