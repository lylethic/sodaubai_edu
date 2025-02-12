import { useToast } from '@/hooks/use-toast';
import {
	CreateLopHocBody,
	CreateLopHocBodyType,
	LopHocSchemaType,
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
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, PlusCircle } from 'lucide-react';
import SchoolSelect from '@/app/(admin)/_components/school-select';
import NamHocSelect from '@/app/(admin)/_components/namHoc-select';
import GradeSelect from '@/app/(admin)/_components/grade-select';
import { Input } from '@/components/ui/input';
import TeachersBySchoolSelect from '@/app/(admin)/_components/teacher-by-school-select';
import { lopHocApiRequest } from '@/apiRequests/lopHoc';
import { Textarea } from '@/components/ui/textarea';

type LopHocType = LopHocSchemaType;
interface Props {
	lopHoc?: LopHocType;
	isOpen: boolean;
	onOpenChange: (value: boolean) => void;
	onSuccess: () => void;
}

export default function ClassAddForm({
	lopHoc,
	isOpen,
	onOpenChange,
	onSuccess,
}: Props) {
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();

	const form = useForm<CreateLopHocBodyType>({
		resolver: zodResolver(CreateLopHocBody),
		defaultValues: {
			GradeId: lopHoc?.gradeId,
			AcademicYearId: lopHoc?.academicYearId,
			TeacherId: lopHoc?.teacherId,
			SchoolId: lopHoc?.schoolId,
			ClassName: lopHoc?.className,
			Status: lopHoc?.status ?? true,
			Description: lopHoc?.description ?? '',
		},
	});

	const selectedSchoolId = useWatch({
		control: form.control,
		name: 'SchoolId',
	});

	const handleCreateLopHoc = async (values: CreateLopHocBodyType) => {
		setLoading(true);
		try {
			const response = await lopHocApiRequest.create({ ...values });

			toast({ description: response.payload.message });
			form.reset();
			if (onSuccess) onSuccess();
		} catch (error: any) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateLopHoc = async (_values: UpdateLopHocBodyType) => {
		if (!lopHoc) return;
		setLoading(true);
		let values = _values;
		try {
			const response = await lopHocApiRequest.update(lopHoc.classId, values);

			toast({ description: response.payload.message });
			form.reset();
			if (onSuccess) onSuccess();
		} catch (error: any) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	async function onSubmit(values: CreateLopHocBodyType) {
		if (loading) return;

		if (!lopHoc) await handleCreateLopHoc(values);
		else {
			await handleUpdateLopHoc(values);
		}
		// console.log('Form Data:', form.getValues());
	}

	useEffect(() => {
		if (lopHoc) {
			form.reset({
				GradeId: lopHoc?.gradeId,
				AcademicYearId: lopHoc?.academicYearId,
				TeacherId: lopHoc?.teacherId,
				SchoolId: lopHoc?.schoolId,
				ClassName: lopHoc?.className,
				Status: lopHoc?.status ?? true,
				Description: lopHoc?.description ?? '',
			});
		} else {
			form.reset();
		}
	}, [isOpen, lopHoc]);

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange} modal={true}>
			<DialogTrigger asChild>
				<Button
					variant={'default'}
					className='bg-green-600 text-white font-semibold my-4'
				>
					<PlusCircle />
					Thêm mới
				</Button>
			</DialogTrigger>
			<DialogContent
				className='sm:max-w-md max-h-[80vh] overflow-y-auto'
				aria-describedby='dialog-description'
			>
				<DialogHeader>
					<DialogTitle>Tạo mới lớp học</DialogTitle>
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
							name='AcademicYearId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Năm học</FormLabel>
									<FormControl>
										<NamHocSelect
											selectedNamHoc={field.value}
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
											selectedSchoolId={field.value}
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
											selectedGradeId={field.value}
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
							name='Description'
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
							name='Status'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Trạng thái hoạt động</FormLabel>
									<Select
										value={
											field.value !== undefined
												? field.value
													? '1'
													: '0'
												: '1'
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
			</DialogContent>
		</Dialog>
	);
}
