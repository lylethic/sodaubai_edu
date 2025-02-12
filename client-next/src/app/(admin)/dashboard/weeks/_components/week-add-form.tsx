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
import { weekApiRequest } from '@/apiRequests/week';
import {
	CreateWeekBody,
	CreateWeekBodyType,
	UpdateWeekBodyType,
	WeekResType,
} from '@/schemaValidations/week.schema';
import SemesterSelect from '@/app/(admin)/_components/semester-select';
import { Input } from '@/components/ui/input';

type WeekType = WeekResType['data'];

export default function WeekAddForm({ week }: { week?: WeekType }) {
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();

	const form = useForm<CreateWeekBodyType>({
		resolver: zodResolver(CreateWeekBody),
		defaultValues: {
			semesterId: week?.semesterId,
			weekName: week?.weekName ?? '',
			weekStart: week?.weekStart ? new Date(week.weekStart) : undefined,
			weekEnd: week?.weekEnd ? new Date(week.weekEnd) : undefined,
			status: week?.status,
		},
	});

	const handleCreateWeek = async (values: CreateWeekBodyType) => {
		setLoading(true);
		try {
			const response = await weekApiRequest.create({
				...values,
				weekStart: new Date(values.weekStart),
				weekEnd: new Date(values.weekEnd),
			});

			toast({ description: response.payload.message });
			form.reset();
		} catch (error: any) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateWeek = async (_values: UpdateWeekBodyType) => {
		if (!week) return;
		setLoading(true);
		try {
			const response = await weekApiRequest.update(week.weekId, {
				..._values,
				weekStart: new Date(_values.weekStart),
				weekEnd: new Date(_values.weekEnd),
			});

			toast({ description: response.payload.message });
			form.reset();
		} catch (error: any) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	async function onSubmit(values: CreateWeekBodyType) {
		if (loading) return;

		if (!week) await handleCreateWeek(values);
		else {
			await handleUpdateWeek(values);
			// console.log('Form Data:', form.getValues());
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
					name='semesterId'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Học kỳ</FormLabel>
							<SemesterSelect
								selected={field.value}
								onSelectedSemester={(semesterId) => field.onChange(semesterId)}
							/>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='weekName'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tên tuần</FormLabel>
							<FormControl>
								<Input
									placeholder='Nhập tên tuần...'
									title='Tên tuần'
									alt='tên tuần'
									type='text'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='weekStart'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Thời gian tuần bắt đầu</FormLabel>
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
					name='weekEnd'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Thời gian tuần kết thúc</FormLabel>
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
					{week ? 'Cập nhật' : 'Thêm mới'}
				</Button>
			</form>
		</Form>
	);
}
