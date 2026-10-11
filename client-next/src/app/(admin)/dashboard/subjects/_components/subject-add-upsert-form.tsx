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
	CreateSubjectBody,
	CreateSubjectBodyType,
	SubjectResType,
	UpdateSubjectBodyType,
} from '@/schemaValidations/subject.schema';
import { subjectApiRequest } from '@/apiRequests/subject';

type SubjectType = SubjectResType['data'];

export default function SubjectUpSertForm({
	subject,
}: {
	subject?: SubjectType;
}) {
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<CreateSubjectBodyType>({
		resolver: zodResolver(CreateSubjectBody),
		defaultValues: {
			id: subject?.id ?? subject?.subjectId ?? 0,
			subjectId: subject?.subjectId ?? subject?.id ?? 0,
			gradeId: subject?.gradeId ?? null,
			name: subject?.name ?? subject?.subjectName ?? '',
			subjectName: subject?.subjectName ?? subject?.name ?? '',
			status: subject?.status ?? true,
			description: subject?.description ?? '',
		},
	});

	const handleCreate = async (values: CreateSubjectBodyType) => {
		setLoading(true);
		try {
			const response = await subjectApiRequest.create(values);

			toast({ description: response.payload.message });
			form.reset();
		} catch (error: any) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	const handleUpdate = async (_values: UpdateSubjectBodyType) => {
		if (!subject) return;
		setLoading(true);
		try {
			const idToUpdate = subject.id ?? subject.subjectId ?? 0;
			const response = await subjectApiRequest.update(
				idToUpdate,
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

	async function onSubmit(values: CreateSubjectBodyType) {
		if (loading) return;

		if (!subject) await handleCreate(values);
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
					name='subjectId'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Mã môn học</FormLabel>
							<FormControl>
								<Input
									type='number'
									placeholder='Mã môn học...'
									alt='Mã môn học...'
									value={field.value ?? 0}
									disabled
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
							<FormLabel>Mã khối lớp</FormLabel>
							<FormControl>
								<Input
									type='number'
									placeholder='Mã khối lớp...'
									alt='Mã khối lớp...'
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
					name='subjectName'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tên hiển thị môn học</FormLabel>
							<FormControl>
								<Textarea
									className='resize-none'
									placeholder='Tên hiển thị môn học...'
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

				<Button type='submit' className='!mt-8 w-full'>
					{subject ? 'Cập nhật' : 'Thêm mới'}
				</Button>
			</form>
		</Form>
	);
}
