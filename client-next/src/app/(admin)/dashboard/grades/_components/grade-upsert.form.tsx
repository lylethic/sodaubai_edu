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
import {
	CreateGradeBody,
	CreateGradeBodyType,
	GradeResType,
	UpdateGradeBodyType,
} from '@/schemaValidations/grade.schema';
import { gradeApiRequest } from '@/apiRequests/grade';

type GradeType = GradeResType['data'];

export default function SchoolUpSertForm({ grade }: { grade?: GradeType }) {
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<CreateGradeBodyType>({
		resolver: zodResolver(CreateGradeBody),
		defaultValues: {
			gradeId: grade?.gradeId ?? 0,
			academicYearId: grade?.academicYearId,
			gradeName: grade?.gradeName,
			description: grade?.description ?? '',
			dateCreated: grade?.dateCreated ? new Date(grade.dateCreated) : null,
			dateUpdated: grade?.dateUpdated ? new Date(grade.dateUpdated) : null,
		},
	});

	const handleCreate = async (values: CreateGradeBodyType) => {
		setLoading(true);
		try {
			const response = await gradeApiRequest.create(values);

			toast({ description: response.payload.message });
			form.reset();
		} catch (error: any) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	const handleUpdate = async (_values: UpdateGradeBodyType) => {
		if (!grade) return;
		setLoading(true);
		try {
			const response = await gradeApiRequest.update(grade.gradeId, _values);

			toast({ description: response.payload.message });
			router.refresh();
		} catch (error: any) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	async function onSubmit(values: CreateGradeBodyType) {
		if (loading) return;

		if (!grade) await handleCreate(values);
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
					name='gradeId'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Mã khối lớp</FormLabel>
							<FormControl>
								<Input
									type='number'
									placeholder='Mã khối lớp...'
									alt='Mã khối lớp...'
									{...field}
									disabled
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					name='academicYearId'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Mã năm học</FormLabel>
							<FormControl>
								<Input
									type='number'
									placeholder='Mã năm học...'
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
					name='gradeName'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tên khối lớp</FormLabel>
							<FormControl>
								<Input placeholder='Tên hiển thị khối lớp...' {...field} />
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
					{grade ? 'Cập nhật' : 'Thêm mới'}
				</Button>
			</form>
		</Form>
	);
}
