'use client';
import React, { useState } from 'react';
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
	UpdateBiaSoDauBaiBody,
	UpdateBiaSoDauBaiBodyType,
} from '@/schemaValidations/biaSoDauBai.schema';
import biaSoDauBaiApiRequest from '@/apiRequests/biasodaubai';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { handleErrorApi } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import SchoolSelect from '@/app/(admin)/_components/school-select';
import LopHocSelect from '@/app/(admin)/_components/lopHoc-select';
import NamHocSelect from '@/app/(admin)/_components/namHoc-select';

type Props = {
	params: { id: string };
	biaSoDauBai: UpdateBiaSoDauBaiBodyType;
};

export default function SoDauBaiEditForm({ params, biaSoDauBai }: Props) {
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<UpdateBiaSoDauBaiBodyType>({
		resolver: zodResolver(UpdateBiaSoDauBaiBody),
		defaultValues: {
			biaSoDauBaiId: biaSoDauBai?.biaSoDauBaiId,
			academicyearId: biaSoDauBai?.academicyearId,
			classId: biaSoDauBai?.classId,
			schoolId: biaSoDauBai?.schoolId,
			status: biaSoDauBai?.status ?? true,
		},
	});

	const selectedSchoolId = useWatch({
		control: form.control,
		name: 'schoolId',
	});

	if (!biaSoDauBai) {
		toast({ description: 'Không tìm thấy bìa sổ đầu bài' });
	}

	const handleEditBiaSoDauBai = async (values: UpdateBiaSoDauBaiBodyType) => {
		setLoading(true);
		try {
			const response = await biaSoDauBaiApiRequest.update(
				Number(params.id),
				values
			);
			toast({
				title: 'Thông báo',
				description: response.payload.message,
			});
		} catch (error: any) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	async function onSubmit(_values: UpdateBiaSoDauBaiBodyType) {
		if (loading) return;
		if (biaSoDauBai) await handleEditBiaSoDauBai(_values);
	}

	return (
		<div className='w-full flex flex-col items-center'>
			<Button
				variant={'default'}
				className='border my-4'
				onClick={() => router.back()}
			>
				<ArrowLeft />
			</Button>
			<FormProvider {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit, (error) => {
						console.log(error);
					})}
					className='text-lg space-y-2 max-w-[600px] flex-shrink-0 w-full'
					noValidate
				>
					<FormField
						control={form.control}
						name='biaSoDauBaiId'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Mã bìa sổ đầu bài</FormLabel>
								<FormControl>
									<Input type='number' {...field} disabled />
								</FormControl>
							</FormItem>
						)}
					/>
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
						name='classId'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Mã lớp học</FormLabel>
								<LopHocSelect
									selectedClassId={field.value}
									selectedSchoolId={selectedSchoolId}
									onSelectedLopHoc={(item) => field.onChange(item)}
								/>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='academicyearId'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Năm học</FormLabel>
								<NamHocSelect
									selectedNamHoc={field.value}
									onSelectedNamHoc={(key) => field.onChange(key)}
								/>
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
					<Button type='submit' className='!mt-8 w-full'>
						Cập nhật
					</Button>
				</form>
			</FormProvider>
		</div>
	);
}
