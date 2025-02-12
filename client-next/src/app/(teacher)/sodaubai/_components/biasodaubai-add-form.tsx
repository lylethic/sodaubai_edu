'use client';

import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
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
	BiaSoDauBaiAddResType,
	CreateBiaSoDauBaiBody,
	CreateBiaSoDauBaiBodyType,
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
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import SchoolSelect from '@/app/(admin)/_components/school-select';
import NamHocSelect from '@/app/(admin)/_components/namHoc-select';
import { Plus, PlusCircle } from 'lucide-react';
import LopHocSelect from '@/app/(admin)/_components/lopHoc-select';

type BiaSoDauBai = BiaSoDauBaiAddResType['data'];

interface Props {
	biaSoDauBai?: BiaSoDauBai;
	isOpen: boolean;
	onOpenChange: (value: boolean) => void;
	onSuccess?: () => void;
}

export default function BiaSoDauBaiAddForm({
	biaSoDauBai,
	isOpen,
	onOpenChange,
	onSuccess,
}: Props) {
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();

	const form = useForm<CreateBiaSoDauBaiBodyType>({
		resolver: zodResolver(CreateBiaSoDauBaiBody),
		defaultValues: {
			AcademicyearId: biaSoDauBai?.academicyearId,
			ClassId: biaSoDauBai?.classId,
			SchoolId: biaSoDauBai?.schoolId,
			Status: biaSoDauBai?.status ?? true,
			DateCreated: biaSoDauBai?.dateCreated,
			DateUpdated: biaSoDauBai?.dateUpdated,
		},
	});

	const selectedSchoolId = useWatch({
		control: form.control,
		name: 'SchoolId',
	});

	const handleAddBiaSoDauBai = async (values: CreateBiaSoDauBaiBodyType) => {
		setLoading(true);
		try {
			const response = await biaSoDauBaiApiRequest.create({ ...values });
			toast({
				title: 'Thông báo',
				description: response.payload.message,
			});

			form.reset();
			if (onSuccess) onSuccess(); // Trigger the callback
		} catch (error: any) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
			onOpenChange(false);
		}
	};

	useEffect(() => {
		if (biaSoDauBai) {
			form.reset({
				AcademicyearId: biaSoDauBai.academicyearId,
				ClassId: biaSoDauBai.classId,
				SchoolId: biaSoDauBai.schoolId,
				Status: biaSoDauBai.status ?? true,
				DateCreated: biaSoDauBai.dateCreated,
				DateUpdated: biaSoDauBai.dateUpdated,
			});
		} else {
			form.reset();
		}
	}, [isOpen, biaSoDauBai]);

	async function onSubmit(values: CreateBiaSoDauBaiBodyType) {
		if (loading) return;
		if (!biaSoDauBai) {
			await handleAddBiaSoDauBai(values);
		}
	}

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
							name='SchoolId'
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
							name='ClassId'
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
							name='AcademicyearId'
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
							name='Status'
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
							Thêm mới
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
