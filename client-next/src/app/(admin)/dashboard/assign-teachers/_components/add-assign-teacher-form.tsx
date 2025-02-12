import React, { useEffect, useState } from 'react';
import { PhanCongChuNhiemApiRequest } from '@/apiRequests/phanCongChuNhiem';
import { useToast } from '@/hooks/use-toast';
import { handleErrorApi } from '@/lib/utils';
import {
	CreatePhanCongChuNhiemBody,
	CreatePhanCongChuNhiemBodyType,
	PhanCongChuNhiemResType,
} from '@/schemaValidations/phanCongChuNhiemLop.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

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
import NamHocSelect from '@/app/(admin)/_components/namHoc-select';
import SchoolSelect from '@/app/(admin)/_components/school-select';
import TeachersBySchoolSelect from '@/app/(admin)/_components/teacher-by-school-select';
import { Textarea } from '@/components/ui/textarea';
import LopHocSelect from '@/app/(admin)/_components/lopHoc-select';

interface Props {
	phanCongChuNhiem?: PhanCongChuNhiemResType['data'];
	isOpen: boolean;
	onOpenChange: (value: boolean) => void;
	onSuccess: () => void;
}

export default function AssignTeacherAddForm({
	phanCongChuNhiem,
	isOpen,
	onOpenChange,
	onSuccess,
}: Props) {
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();
	const [selectedSchoolId, setSelectedSchoolId] = useState<number | null>(0);

	const form = useForm<CreatePhanCongChuNhiemBodyType>({
		resolver: zodResolver(CreatePhanCongChuNhiemBody),
		defaultValues: {
			AcademicYearId: phanCongChuNhiem?.academicYearId,
			TeacherId: phanCongChuNhiem?.teacherId,
			ClassId: phanCongChuNhiem?.classId,
			Description: phanCongChuNhiem?.description,
			Status: phanCongChuNhiem?.status ?? true,
		},
	});

	const handleCreate = async (values: CreatePhanCongChuNhiemBodyType) => {
		setLoading(true);
		try {
			const response = await PhanCongChuNhiemApiRequest.create({ ...values });
			toast({ description: response.payload.message });
			form.reset();
			if (onSuccess) onSuccess();
		} catch (error) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	const onSubmit = async (values: CreatePhanCongChuNhiemBodyType) => {
		if (loading) return;
		await handleCreate(values);
	};

	useEffect(() => {
		if (phanCongChuNhiem) {
			form.reset({
				AcademicYearId: phanCongChuNhiem?.academicYearId,
				TeacherId: phanCongChuNhiem?.teacherId,
				ClassId: phanCongChuNhiem?.classId,
				Description: phanCongChuNhiem?.description,
				Status: phanCongChuNhiem?.status ?? true,
			});
		} else {
			form.reset();
		}
	}, [isOpen, phanCongChuNhiem]);

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange} modal={true}>
			<DialogTrigger asChild>
				<Button
					variant={'default'}
					className='bg-green-600 text-white font-semibold my-4'
				>
					<PlusCircle />
					Thêm mới phân công chủ nhiệm
				</Button>
			</DialogTrigger>
			<DialogContent
				className='sm:max-w-md max-h-[80vh] overflow-y-auto'
				aria-describedby='dialog-description'
			>
				<DialogHeader>
					<DialogTitle>Tạo mới phân công chủ nhiệm</DialogTitle>
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
							name='ClassId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Lớp dạy</FormLabel>
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
							name='Description'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Ghi chú</FormLabel>
									<FormControl>
										<Textarea
											className='resize-none'
											placeholder='Ghi chú'
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
							Thêm mới phân công chủ nhiệm
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
