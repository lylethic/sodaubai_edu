'use client';
import { useToast } from '@/hooks/use-toast';
import {
	LopHocSchemaType,
	UpdateLopHocBody,
	UpdateLopHocBodyType,
} from '@/schemaValidations/lopHoc.shema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
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
import SchoolSelect from '@/app/(admin)/_components/school-select';
import NamHocSelect from '@/app/(admin)/_components/namHoc-select';
import GradeSelect from '@/app/(admin)/_components/grade-select';
import { Input } from '@/components/ui/input';
import TeachersBySchoolSelect from '@/app/(admin)/_components/teacher-by-school-select';
import { lopHocApiRequest } from '@/apiRequests/lopHoc';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

type Props = {
	params: { id: string };
	lopHoc: LopHocSchemaType;
};

export default function ClassEditForm({ params, lopHoc }: Props) {
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<UpdateLopHocBodyType>({
		resolver: zodResolver(UpdateLopHocBody),
		defaultValues: {
			GradeId: lopHoc?.gradeId ?? undefined,
			AcademicYearId: lopHoc?.academicYearId ?? undefined,
			TeacherId: lopHoc?.teacherId ?? undefined,
			SchoolId: lopHoc?.schoolId ?? undefined,
			ClassName: lopHoc?.className || lopHoc?.name || '',
			Status: lopHoc?.status ?? true,
			Description: lopHoc?.description ?? '',
		},
	});

	const selectedSchoolId = useWatch({
		control: form.control,
		name: 'SchoolId',
	});

	const handleUpdateLopHoc = async (_values: UpdateLopHocBodyType) => {
		if (!lopHoc) return;
		setLoading(true);
		try {
			const idToUpdate =
				lopHoc.id ?? lopHoc.classId ?? Number(params.id);
			const response = await lopHocApiRequest.update(idToUpdate, _values);

			toast({ description: response.payload.message });
			router.refresh();
			form.reset();
		} catch (error: any) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (lopHoc) {
			form.reset({
				GradeId: lopHoc?.gradeId ?? undefined,
				AcademicYearId: lopHoc?.academicYearId ?? undefined,
				TeacherId: lopHoc?.teacherId ?? undefined,
				SchoolId: lopHoc?.schoolId ?? undefined,
				ClassName: lopHoc?.className || lopHoc?.name || '',
				Status: lopHoc?.status ?? true,
				Description: lopHoc?.description ?? '',
			});
		} else {
			form.reset();
		}
	}, [lopHoc, form]);

	async function onSubmit(values: UpdateLopHocBodyType) {
		if (loading) return;
		if (lopHoc) await handleUpdateLopHoc(values);
	}

	return (
		<>
			<Button
				variant={'default'}
				onClick={() => router.back()}
				className='my-4'
			>
				<ArrowLeft />
			</Button>
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
						name='AcademicYearId'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Năm học</FormLabel>
								<FormControl>
									<NamHocSelect
										selectedNamHoc={field.value ?? null}
										onSelectedNamHoc={(key) => field.onChange(key)}
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
								<FormControl>
									<SchoolSelect
										selectedSchoolId={field.value ?? null}
										onSelectSchool={(schoolId) => field.onChange(schoolId)}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='GradeId'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Khối lớp học</FormLabel>
								<FormControl>
									<GradeSelect
										selectedGradeId={field.value ?? null}
										onSelectedGrade={(gradeId) => field.onChange(gradeId)}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='ClassName'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Tên lớp</FormLabel>
								<FormControl>
									<Input
										type='text'
										placeholder='Vui lòng nhập tên lớp'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='TeacherId'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Giáo viên chủ nhiệm</FormLabel>
								<FormControl>
									<TeachersBySchoolSelect
										selectedSchoolId={selectedSchoolId ?? 0}
										selectedTeacherId={field.value ?? 0}
										onSelectTeacher={(teacherId) => field.onChange(teacherId)}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='Description'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Ghi chú</FormLabel>
								<FormControl>
									<Textarea
										className='resize-none'
										rows={3}
										placeholder='Ghi chú'
										value={field.value ?? ''}
										onChange={field.onChange}
									/>
								</FormControl>
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
						{lopHoc ? 'Cập nhật lớp học' : 'Thêm mới lớp học'}
					</Button>
				</form>
			</Form>
		</>
	);
}
