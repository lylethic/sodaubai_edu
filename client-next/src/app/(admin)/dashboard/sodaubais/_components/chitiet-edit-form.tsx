'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@/components/ui/form';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { handleErrorApi } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import {
	UpdateChiTietBody,
	UpdateChiTietBodyType,
} from '@/schemaValidations/chiTietSoDauBai.schema';
import chiTietSoDauBaiApiRequest from '@/apiRequests/chiTietSoDauBai';
import { Textarea } from '@/components/ui/textarea';
import SemesterSelect from '@/app/(admin)/_components/semester-select';
import WeekSelect from '@/app/(admin)/_components/week-select';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SubjectSelect from '@/app/(admin)/_components/subject-select';
import XepLoaiTietHocSelect from '@/app/(admin)/_components/xeploai-tiethoc-select';

interface Props {
	params: {
		chiTietSoDauBaiId: string;
	};
	chiTietSoDauBai: UpdateChiTietBodyType;
}

export default function ChiTietEditForm({ params, chiTietSoDauBai }: Props) {
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<UpdateChiTietBodyType>({
		resolver: zodResolver(UpdateChiTietBody),
		defaultValues: {
			biaSoDauBaiId: chiTietSoDauBai?.biaSoDauBaiId,
			semesterId: chiTietSoDauBai?.semesterId,
			weekId: chiTietSoDauBai?.weekId,
			subjectId: chiTietSoDauBai?.subjectId,
			classificationId: chiTietSoDauBai?.classificationId,
			daysOfTheWeek: chiTietSoDauBai?.daysOfTheWeek,
			thoiGian: chiTietSoDauBai?.thoiGian
				? new Date(chiTietSoDauBai.thoiGian)
				: undefined,
			buoiHoc: chiTietSoDauBai?.buoiHoc,
			tietHoc: chiTietSoDauBai?.tietHoc,
			lessonContent: chiTietSoDauBai?.lessonContent,
			attend: chiTietSoDauBai?.attend,
			noteComment: chiTietSoDauBai?.noteComment,
			createdBy: chiTietSoDauBai?.createdBy,
		},
	});

	const handleEditChiTietBiaSoDauBai = async (
		values: UpdateChiTietBodyType
	) => {
		setLoading(true);
		try {
			const response = await chiTietSoDauBaiApiRequest.update(
				Number(params.chiTietSoDauBaiId),
				values
			);
			toast({ description: response.payload.message });
		} catch (error) {
			handleErrorApi({ error, setError: form.setError });
		} finally {
			setLoading(false);
		}
	};

	async function onSubmit(_values: UpdateChiTietBodyType) {
		if (loading) return;
		if (chiTietSoDauBai) await handleEditChiTietBiaSoDauBai(_values);
	}

	return (
		<div className='w-full flex flex-col items-center'>
			<Button
				variant={'default'}
				title='Quay về'
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
									<Input
										placeholder='Lớp học...'
										type='text'
										{...field}
										disabled
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='semesterId'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Học kỳ</FormLabel>
								<SemesterSelect
									selected={field.value}
									onSelectedSemester={(semesterId) =>
										field.onChange(semesterId)
									}
								/>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='weekId'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Tuần học</FormLabel>
								<WeekSelect
									selectedWeekId={field.value}
									onSelectWeek={(weekId) => field.onChange(weekId)}
								/>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='subjectId'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Môn học</FormLabel>
								<SubjectSelect
									selected={field.value}
									onSelectedSubject={(subjectId) => field.onChange(subjectId)}
								/>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='classificationId'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Xếp loại tiết học</FormLabel>
								<XepLoaiTietHocSelect
									selected={field.value}
									onSelectedClassify={(classificationId) =>
										field.onChange(classificationId)
									}
								/>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='daysOfTheWeek'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Thứ</FormLabel>
								<FormControl>
									<Input type='text' {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='thoiGian'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Ngày/tháng/năm</FormLabel>
								<FormControl>
									<Input
										placeholder='Ngày học...'
										type='date'
										{...field}
										value={
											field.value
												? new Date(field.value).toLocaleDateString('en-CA')
												: ''
										}
										onChange={(e) =>
											field.onChange(
												e.target.value ? new Date(e.target.value) : undefined
											)
										}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='buoiHoc'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Buổi học</FormLabel>
								<FormControl>
									<Input placeholder='Buổi học...' type='text' {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='tietHoc'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Tiết học</FormLabel>
								<FormControl>
									<Input
										placeholder='Tiết...'
										type='text'
										{...field}
										onChange={(e) => field.onChange(Number(e.target.value))}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='lessonContent'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Nội dung công việc</FormLabel>
								<FormControl>
									<Textarea
										className='resize-none'
										placeholder='Nội dung công việc...'
										rows={3}
										{...field}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='attend'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Sĩ số</FormLabel>
								<FormControl>
									<Input
										placeholder='Sĩ số...'
										type='text'
										{...field}
										onChange={(e) => field.onChange(Number(e.target.value))}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='noteComment'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Ghi chú</FormLabel>
								<FormControl>
									<Textarea
										className='resize-none'
										placeholder='Nhận xét...'
										rows={3}
										{...field}
										value={
											field.value !== undefined ? field.value?.toString() : ''
										}
										onChange={(e) =>
											field.onChange(
												e.target.value ? String(e.target.value) : ''
											)
										}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='createdBy'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Ký tên (Mã giáo viên)</FormLabel>
								<FormControl>
									<Input
										placeholder='Ký tên...'
										type='text'
										{...field}
										onChange={(e) => field.onChange(Number(e.target.value))}
									/>
								</FormControl>
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
