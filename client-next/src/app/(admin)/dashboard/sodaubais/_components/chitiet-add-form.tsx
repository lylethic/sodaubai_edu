'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@/components/ui/form';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import {
	formatDateToVietnam,
	handleErrorApi,
	normalizeDateToVietnam,
} from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { PlusCircle } from 'lucide-react';
import {
	ChiTietAddResType,
	CreateChiTietBody,
	CreateChiTietBodyType,
} from '@/schemaValidations/chiTietSoDauBai.schema';
import chiTietSoDauBaiApiRequest from '@/apiRequests/chiTietSoDauBai';
import { Textarea } from '@/components/ui/textarea';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import SemesterSelect from '@/app/(admin)/_components/semester-select';
import WeekSelect from '@/app/(admin)/_components/week-select';
import SubjectSelect from '@/app/(admin)/_components/subject-select';
import XepLoaiTietHocSelect from '@/app/(admin)/_components/xeploai-tiethoc-select';

interface Props {
	chiTietSoDauBai?: ChiTietAddResType['data'];
	isOpen: boolean;
	onOpenChange: (value: boolean) => void;
	onSuccess?: () => void;
}

export default function ChiTietSodauBaiAddForm({
	isOpen,
	onOpenChange,
	onSuccess,
	chiTietSoDauBai,
}: Props) {
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();

	const form = useForm<CreateChiTietBodyType>({
		resolver: zodResolver(CreateChiTietBody),
		defaultValues: {
			BiaSoDauBaiId: chiTietSoDauBai?.biaSoDauBaiId,
			SemesterId: chiTietSoDauBai?.semesterId,
			WeekId: chiTietSoDauBai?.weekId,
			DaysOfTheWeek: chiTietSoDauBai?.daysOfTheWeek,
			ThoiGian: chiTietSoDauBai?.thoiGian,
			BuoiHoc: chiTietSoDauBai?.buoiHoc,
			TietHoc: chiTietSoDauBai?.tietHoc,
			LessonContent: chiTietSoDauBai?.lessonContent,
			Attend: chiTietSoDauBai?.attend,
			NoteComment: chiTietSoDauBai?.noteComment,
			CreatedBy: chiTietSoDauBai?.createdBy,
		},
	});

	const handleCreateChiTietBiaSoDauBai = async (
		values: CreateChiTietBodyType
	) => {
		setLoading(true);
		try {
			const response = await chiTietSoDauBaiApiRequest.create({ ...values });
			toast({
				title: 'Thông báo',
				description: response.payload.message,
			});
			form.reset();
			if (onSuccess) onSuccess();
		} catch (error: any) {
			handleErrorApi({ error, setError: form.setError });
		} finally {
			setLoading(false);
			onOpenChange(false);
		}
	};
	const formValues = useWatch({ control: form.control });

	useEffect(() => {
		if (chiTietSoDauBai) {
			form.reset({
				BiaSoDauBaiId: chiTietSoDauBai?.biaSoDauBaiId || 0,
				SemesterId: chiTietSoDauBai?.semesterId || 0,
				WeekId: chiTietSoDauBai?.weekId || 0,
				DaysOfTheWeek: chiTietSoDauBai?.daysOfTheWeek || '',
				ThoiGian: chiTietSoDauBai?.thoiGian || '',
				BuoiHoc: chiTietSoDauBai?.buoiHoc || '',
				TietHoc: chiTietSoDauBai?.tietHoc || 0,
				LessonContent: chiTietSoDauBai?.lessonContent || '',
				Attend: chiTietSoDauBai?.attend || 0,
				NoteComment: chiTietSoDauBai?.noteComment || '',
				CreatedBy: chiTietSoDauBai?.createdBy || 0,
			});
		} else {
			form.reset();
		}
	}, [isOpen, chiTietSoDauBai]);

	async function onSubmit(values: CreateChiTietBodyType) {
		if (loading) return;
		await handleCreateChiTietBiaSoDauBai(values);
	}

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange} modal={true}>
			<DialogTrigger asChild>
				<Button
					variant={'outline'}
					className='text-white bg-green-600 rounded-full'
				>
					<PlusCircle />
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-md max-h-[80vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>Tạo mới sổ đầu bài</DialogTitle>
				</DialogHeader>
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
							name='BiaSoDauBaiId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Mã bìa sổ đầu bài</FormLabel>
									<FormControl>
										<Input
											placeholder='Lớp học...'
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
							name='SemesterId'
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
							name='WeekId'
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
							name='DaysOfTheWeek'
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
							name='ThoiGian'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Ngày/tháng/năm</FormLabel>
									<FormControl>
										<Input
											placeholder='Ngày học...'
											type='date'
											{...field}
											value={
												field.value ? formatDateToVietnam(field.value) : ''
											}
											onChange={(e) => {
												const dateValue = e.target.value;
												field.onChange(
													dateValue ? normalizeDateToVietnam(dateValue) : null
												);
											}}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='BuoiHoc'
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
							name='SubjectId'
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
							name='TietHoc'
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
							name='ClassificationId'
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
							name='LessonContent'
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
							name='Attend'
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
							name='NoteComment'
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
							name='CreatedBy'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Ký tên</FormLabel>
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
							Tạo mới
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
