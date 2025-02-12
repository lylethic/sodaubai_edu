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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import {
	CreateStudentBody,
	CreateStudentBodyType,
	StudentResType,
	UpdateStudentBodyType,
} from '@/schemaValidations/student.schema';
import { studentApiRequest } from '@/apiRequests/student';
import GradeSelect from '@/app/(admin)/_components/grade-select';
import LopHocSelect from '@/app/(admin)/_components/lopHoc-select';
import SchoolSelect from '@/app/(admin)/_components/school-select';
import AccountSelect from '@/app/(admin)/_components/account-select';
import DropdownInput from './dropdown-input';

type StudentType = StudentResType['data'];

export default function StudentUpSertForm({
	student,
}: {
	student?: StudentType;
}) {
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();
	const router = useRouter();
	const [selectedSchoolId, setSelectedSchoolId] = useState<number | null>(0);

	const form = useForm<CreateStudentBodyType>({
		resolver: zodResolver(CreateStudentBody),
		defaultValues: {
			studentId: student?.studentId ?? 0,
			accountId: student?.accountId,
			classId: student?.classId,
			gradeId: student?.gradeId,
			fullname: student?.fullname ?? '',
			dateOfBirth: student?.dateOfBirth
				? new Date(student.dateOfBirth)
				: undefined,
			dateCreated: student?.dateCreated ? new Date(student.dateCreated) : null,
			dateUpdated: student?.dateUpdated ? new Date(student.dateUpdated) : null,
			status: student?.status ?? true,
			description: student?.description ?? '',
			address: student?.address ?? '',
		},
	});

	const handleCreate = async (values: CreateStudentBodyType) => {
		setLoading(true);
		try {
			const response = await studentApiRequest.create(values);

			toast({ description: response.payload.message });
			form.reset();
		} catch (error: any) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	const handleUpdate = async (_values: UpdateStudentBodyType) => {
		if (!student) return;
		setLoading(true);
		try {
			const response = await studentApiRequest.update(student.studentId, {
				..._values,
				dateOfBirth: new Date(_values.dateOfBirth),
			});

			toast({ description: response.payload.message });
			router.refresh();
		} catch (error: any) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	async function onSubmit(values: CreateStudentBodyType) {
		if (loading) return;

		if (!student) await handleCreate(values);
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
					name='studentId'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Mã học sinh</FormLabel>
							<FormControl>
								<Input
									type='number'
									placeholder='Mã học sinh...'
									alt='Mã học sinh...'
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
					name='accountId'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tài khoản</FormLabel>
							<FormControl>
								<AccountSelect
									selectedRoleId={1}
									selectedSchoolId={selectedSchoolId}
									selectedAccount={field.value}
									onSelectedAccount={(accountId) => {
										field.onChange(accountId);
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='gradeId'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Khối lớp</FormLabel>
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
					name='classId'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Lớp học</FormLabel>
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
					name='fullname'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Họ và tên</FormLabel>
							<FormControl>
								<Input
									placeholder='Vui lòng nhập họ và tên...'
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
					name='dateOfBirth'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ngày sinh</FormLabel>
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
											e.target.value ? new Date(e.target.value) : null
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
					name='address'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Địa chỉ</FormLabel>
							<FormControl>
								<Textarea
									placeholder='Vui lòng nhập địa chỉ...'
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
				<FormField
					control={form.control}
					name='dateCreated'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Thời gian tạo</FormLabel>
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
											e.target.value ? new Date(e.target.value) : null
										)
									}
									disabled
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='dateUpdated'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Thời gian cập nhật</FormLabel>
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
											e.target.value ? new Date(e.target.value) : null
										)
									}
									disabled
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type='submit' className='!mt-8 w-full'>
					{student ? 'Cập nhật' : 'Thêm mới'}
				</Button>
			</form>
		</Form>
	);
}
