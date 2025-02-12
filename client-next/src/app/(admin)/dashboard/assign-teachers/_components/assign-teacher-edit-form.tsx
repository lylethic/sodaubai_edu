'use client';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { handleErrorApi } from '@/lib/utils';
import { PhanCongChuNhiemApiRequest } from '@/apiRequests/phanCongChuNhiem';
import { Button } from '@/components/ui/button';
import {
	UpdatePhanCongChuNhiemBody,
	UpdatePhanCongChuNhiemBodyType,
} from '@/schemaValidations/phanCongChuNhiemLop.schema';
import NamHocSelect from '@/app/(admin)/_components/namHoc-select';
import SchoolSelect from '@/app/(admin)/_components/school-select';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import TeachersBySchoolSelect from '@/app/(admin)/_components/teacher-by-school-select';
import LopHocSelect from '@/app/(admin)/_components/lopHoc-select';
import { Textarea } from '@/components/ui/textarea';

interface EditFormProps {
	params: { id: string };
	phanCongChuNhiem: UpdatePhanCongChuNhiemBodyType;
}

export default function AssignTeacherEditForm({
	params,
	phanCongChuNhiem,
}: EditFormProps) {
	const { toast } = useToast();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [selectedSchoolId, setSelectedSchoolId] = useState<number | null>(0);

	const form = useForm<UpdatePhanCongChuNhiemBodyType>({
		resolver: zodResolver(UpdatePhanCongChuNhiemBody),
		defaultValues: {
			phanCongChuNhiemId: phanCongChuNhiem?.phanCongChuNhiemId,
			academicYearId: phanCongChuNhiem?.academicYearId,
			teacherId: phanCongChuNhiem?.teacherId,
			classId: phanCongChuNhiem?.classId,
			description: phanCongChuNhiem?.description ?? '_',
			status: phanCongChuNhiem?.status ?? true,
		},
	});

	const hanldeEdit = async (values: UpdatePhanCongChuNhiemBodyType) => {
		try {
			const response = await PhanCongChuNhiemApiRequest.update(
				Number(params.id),
				values
			);
			toast({ description: response.payload.message });
		} catch (error) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	async function onSubmit(values: UpdatePhanCongChuNhiemBodyType) {
		if (loading) return;
		if (phanCongChuNhiem) await hanldeEdit(values);
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
					onSubmit={form.handleSubmit(onSubmit, (error) =>
						console.error(error)
					)}
					className='text-lg space-y-2 max-w-[600px] flex-shrink-0 w-full'
					noValidate
				>
					<FormField
						control={form.control}
						name='phanCongChuNhiemId'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Mã phân công chủ nhiệm</FormLabel>
								<FormControl>
									<Input
										placeholder='Mã phân công chủ nhiệm...'
										type='text'
										{...field}
										disabled
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='academicYearId'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Năm học</FormLabel>
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
						name='SchoolId'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Trường học</FormLabel>
								<FormControl>
									<SchoolSelect
										selectedSchoolId={field.value}
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
						name='teacherId'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Giáo viên chủ nhiệm</FormLabel>
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
						name='classId'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Lớp chủ nhiệm</FormLabel>
								<FormControl>
									<LopHocSelect
										selectedSchoolId={selectedSchoolId}
										selectedClassId={field.value}
										onSelectedLopHoc={(classId) => field.onChange(classId)}
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
										rows={3}
										placeholder='Ghi chú'
										{...field}
									/>
								</FormControl>
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
						Cập nhật
					</Button>
				</form>
			</FormProvider>
		</div>
	);
}
