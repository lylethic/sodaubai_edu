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
	CreateSemesterBody,
	CreateSemesterBodyType,
	SemesterResType,
	UpdateSemesterBodyType,
} from '@/schemaValidations/semester.schema';
import { useRouter } from 'next/navigation';
import { semesterApiRequest } from '@/apiRequests/semester';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import NamHocSelect from '@/app/(admin)/_components/namHoc-select';

type SemesterType = SemesterResType['data'];

export default function SemesterUpSertForm({
	semester,
}: {
	semester?: SemesterType;
}) {
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<CreateSemesterBodyType>({
		resolver: zodResolver(CreateSemesterBody),
		defaultValues: {
			semesterId: semester?.semesterId ?? 0,
			academicYearId: semester?.academicYearId,
			semesterName: semester?.semesterName ?? '',
			dateStart: semester?.dateStart ? new Date(semester.dateStart) : undefined,
			dateEnd: semester?.dateEnd ? new Date(semester.dateEnd) : undefined,
			status: semester?.status,
			description: semester?.description ?? '',
		},
	});

	const handleCreate = async (values: CreateSemesterBodyType) => {
		setLoading(true);
		try {
			const response = await semesterApiRequest.create({
				...values,
				dateStart: new Date(values.dateStart),
				dateEnd: new Date(values.dateEnd),
			});

			toast({ description: response.payload.message });
			form.reset();
		} catch (error: any) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	const handleUpdate = async (_values: UpdateSemesterBodyType) => {
		if (!semester) return;
		setLoading(true);
		try {
			const response = await semesterApiRequest.update(semester.semesterId, {
				..._values,
				dateStart: new Date(_values.dateStart),
				dateEnd: new Date(_values.dateEnd),
			});

			toast({ description: response.payload.message });
			router.refresh();
		} catch (error: any) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	async function onSubmit(values: CreateSemesterBodyType) {
		if (loading) return;

		if (!semester) await handleCreate(values);
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
								<NamHocSelect
									selectedNamHoc={field.value}
									onSelectedNamHoc={(academicYearId) =>
										field.onChange(academicYearId)
									}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='semesterId'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Mã học kỳ</FormLabel>
							<FormControl>
								<Input
									type='text'
									placeholder='Mã học kỳ...'
									alt='Mã học kỳ...'
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
					name='semesterName'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tên hiển thị học kỳ</FormLabel>
							<FormControl>
								<Input
									type='text'
									placeholder='Nhập tên hiển thị học. kỳ..'
									alt='Nhập tên hiển thị học. kỳ..'
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
					name='dateStart'
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
					name='dateEnd'
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
					{semester ? 'Cập nhật' : 'Thêm mới'}
				</Button>
			</form>
		</Form>
	);
}
