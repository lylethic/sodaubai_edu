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
	CreateSchoolBody,
	CreateSchoolBodyType,
	SchoolResType,
	UpdateSchoolBodyType,
} from '@/schemaValidations/school.schema';
import schoolApiRequest from '@/apiRequests/school';

type SchoolType = SchoolResType['data'];

export default function SchoolUpSertForm({ school }: { school?: SchoolType }) {
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();
	const router = useRouter();
	const [selectedSchoolId, setSelectedSchoolId] = useState<number | null>(0);

	const form = useForm<CreateSchoolBodyType>({
		resolver: zodResolver(CreateSchoolBody),
		defaultValues: {
			schoolId: school?.schoolId ?? 0,
			provinceId: school?.provinceId,
			districtId: school?.districtId,
			nameSchool: school?.nameSchool ?? '',
			address: school?.address ?? '',
			phoneNumber: school?.phoneNumber,
			schoolType: school?.schoolType,
			description: school?.description ?? '',
			dateCreated: school?.dateCreated ? new Date(school.dateCreated) : null,
			dateUpdated: school?.dateUpdated ? new Date(school.dateUpdated) : null,
		},
	});

	const handleCreate = async (values: CreateSchoolBodyType) => {
		setLoading(true);
		try {
			const response = await schoolApiRequest.createSchool(values);

			toast({ description: response.payload.message });
			form.reset();
		} catch (error: any) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	const handleUpdate = async (_values: UpdateSchoolBodyType) => {
		if (!school) return;
		setLoading(true);
		try {
			const response = await schoolApiRequest.updateSchool(
				school.schoolId,
				_values
			);

			toast({ description: response.payload.message });
			router.refresh();
		} catch (error: any) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	async function onSubmit(values: CreateSchoolBodyType) {
		if (loading) return;

		if (!school) await handleCreate(values);
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
					name='schoolId'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Mã trường học</FormLabel>
							<FormControl>
								<Input
									type='number'
									placeholder='Mã trường học...'
									alt='Mã trường học...'
									value={field.value}
									disabled
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					name='provinceId'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Mã tỉnh thành</FormLabel>
							<FormControl>
								<Input
									type='number'
									placeholder='Mã tỉnh thành...'
									value={field.value ?? ''}
									onChange={(e) => field.onChange(Number(e.target.value))}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					name='districtId'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Mã huyện</FormLabel>
							<FormControl>
								<Input
									type='number'
									placeholder='Mã huyện...'
									value={field.value ?? ''}
									onChange={(e) => field.onChange(Number(e.target.value))}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='nameSchool'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tên trường học</FormLabel>
							<FormControl>
								<Input placeholder='Tên hiển thị trường học...' {...field} />
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
									placeholder='Địa chỉ trường học...'
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
					name='phoneNumber'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Số điện thoại</FormLabel>
							<FormControl>
								<Input
									placeholder='Vui lòng số điện thoại...'
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
					name='schoolType'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Phân loại trường học</FormLabel>
							<Select
								value={field.value}
								onValueChange={(value) => field.onChange(value)}
							>
								<SelectTrigger className='w-[180px]'>
									<SelectValue placeholder='Chọn loại trường' />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Phân loại trường học</SelectLabel>
										<SelectItem value='Công lập'>Trường công lập</SelectItem>
										<SelectItem value='Tư thục'>Trường tư thục</SelectItem>
										<SelectItem value='Dân lập'>Trường Dân lập</SelectItem>
										<SelectItem value='Quốc tế'>Trường Quốc tế</SelectItem>
										<SelectItem value='Song ngữ'>Trường Song ngữ</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
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
					name='dateCreated'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Thời gian tạo</FormLabel>
							<FormControl>
								<Input
									type='date'
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
					{school ? 'Cập nhật' : 'Thêm mới'}
				</Button>
			</form>
		</Form>
	);
}
