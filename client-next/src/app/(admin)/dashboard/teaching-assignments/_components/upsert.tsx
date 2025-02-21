'use client';

import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { handleErrorApi } from '@/lib/utils';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	CreatePhanCongBody,
	CreatePhanCongBodyType,
	PhanCongGiangDayResType,
	UpdatePhanCongBodyType,
} from '@/schemaValidations/phanCongGiangDayBia';
import { phanCongGiangDayApiRequest } from '@/apiRequests/phanCongGiangDay';
import SchoolSelect from '@/app/(admin)/_components/school-select';
import SoDauBaiSelect from '@/app/(admin)/_components/sodaubai-select';
import TeachersBySchoolSelect from '@/app/(admin)/_components/teacher-by-school-select';
import { useAppContext } from '@/app/app-provider';

type TeachingAssignmentType = PhanCongGiangDayResType['data'];

export default function TeachingAssignmentUpSert({
	data,
}: {
	data?: TeachingAssignmentType;
}) {
	const { user } = useAppContext();
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();
	const router = useRouter();
	const [selectedSchoolId, setSelectedSchoolId] = useState<number>(0);

	const form = useForm<CreatePhanCongBodyType>({
		resolver: zodResolver(CreatePhanCongBody),
		defaultValues: {
			phanCongGiangDayId: data?.phanCongGiangDayId ?? 0,
			biaSoDauBaiId: data?.biaSoDauBaiId ?? 0,
			teacherId: data?.teacherId ?? 0,
			status: data?.status ?? true,
		},
	});
	const handleCreate = async (values: CreatePhanCongBodyType) => {
		setLoading(true);

		try {
			const { payload } = await phanCongGiangDayApiRequest.create(values);
			toast({ description: payload.message });
			form.reset();
		} catch (error) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	const handleUpdate = async (_values: UpdatePhanCongBodyType) => {
		// if (!user) {
		// 	toast({ description: 'Không có thông tin người dùng!' });
		// }
		if (!data) return;
		setLoading(true);

		try {
			const { payload } = await phanCongGiangDayApiRequest.update(
				data.phanCongGiangDayId,
				_values
			);
			toast({ description: payload.message });
			form.reset();
		} catch (error) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	async function onSubmit(values: CreatePhanCongBodyType) {
		if (loading) return;

		if (!data) await handleCreate(values);
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
					name='phanCongGiangDayId'
					render={({ field }) => (
						<FormItem className='hidden'>
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
					name='schoolId'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Trường học</FormLabel>
							<FormControl>
								<SchoolSelect
									selectedSchoolId={selectedSchoolId}
									onSelectSchool={(schoolId) => {
										field.onChange(schoolId);
										setSelectedSchoolId(schoolId);
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='biaSoDauBaiId'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Sổ đầu bài lớp</FormLabel>
							<FormControl>
								<SoDauBaiSelect
									selectedSchoolId={selectedSchoolId}
									selectedSoDauBaiId={field.value}
									onSelectedSoDauBai={(biaSoDauBaiId) =>
										field.onChange(biaSoDauBaiId)
									}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='teacherId'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Phân công giáo viên giảng dạy</FormLabel>
							<FormControl>
								<TeachersBySchoolSelect
									selectedSchoolId={selectedSchoolId}
									selectedTeacherId={field.value}
									onSelectTeacher={(teacherId) => field.onChange(teacherId)}
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
					{data ? 'Cập nhật' : 'Thêm mới'}
				</Button>
			</form>
		</Form>
	);
}
