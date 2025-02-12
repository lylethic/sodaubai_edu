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
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import schoolApiRequest from '@/apiRequests/school';
import {
	ClassifyResType,
	CreateClassifyBody,
	CreateClassifyBodyType,
	UpdateClassifyBodyType,
} from '@/schemaValidations/xepLoaiTietHoc.schema';
import { xepLoaiApiRequest } from '@/apiRequests/xeploaiTiethoc';

type ClassifyType = ClassifyResType['data'];

export default function ClassifyUpSertForm({
	classify,
}: {
	classify?: ClassifyType;
}) {
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<CreateClassifyBodyType>({
		resolver: zodResolver(CreateClassifyBody),
		defaultValues: {
			classificationId: classify?.classificationId ?? 0,
			classifyName: classify?.classifyName,
			score: classify?.score,
		},
	});

	const handleCreate = async (values: CreateClassifyBodyType) => {
		setLoading(true);
		try {
			const { payload } = await xepLoaiApiRequest.create(values);

			toast({ description: payload.message });
			form.reset();
		} catch (error: any) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	const handleUpdate = async (_values: UpdateClassifyBodyType) => {
		if (!classify) return;
		setLoading(true);
		try {
			const response = await xepLoaiApiRequest.update(
				classify.classificationId,
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

	async function onSubmit(values: CreateClassifyBodyType) {
		if (loading) return;

		if (!classify) await handleCreate(values);
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
					name='classificationId'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Mã xếp loại</FormLabel>
							<FormControl>
								<Input
									type='number'
									placeholder='Mã xếp loại...'
									alt='Mã xếp loại...'
									{...field}
									disabled
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='classifyName'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tên hiển thị</FormLabel>
							<FormControl>
								<Input type='text' placeholder='Tên hiển thị...' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='score'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Số điểm</FormLabel>
							<FormControl>
								<Input
									type='number'
									placeholder='Số điểm...'
									value={field.value}
									onChange={(e) => field.onChange(Number(e.target.value))}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type='submit' className='!mt-8 w-full'>
					{classify ? 'Cập nhật' : 'Thêm mới'}
				</Button>
			</form>
		</Form>
	);
}
