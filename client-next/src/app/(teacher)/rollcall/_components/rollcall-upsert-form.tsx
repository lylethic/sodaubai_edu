'use client';

import { rollcallApiRequest } from '@/apiRequests/rollcall';
import { useToast } from '@/hooks/use-toast';
import { handleErrorApi } from '@/lib/utils';
import {
	CreateAbsenceType,
	CreateRollCallBody,
	CreateRollCallBodyType,
	CreateRollCallDetailBodyType,
	CreateRollCallType,
	RollCallByIdType,
	RollCallResType,
} from '@/schemaValidations/rollcall-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Form, useFieldArray, useForm } from 'react-hook-form';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import WeekSelect from '@/app/(admin)/_components/week-select';
import LopHocSelect from '@/app/(admin)/_components/lopHoc-select';
import DayOfTheWeek from '@/app/(admin)/_components/dayOfTheWeek';
import { Input } from '@/components/ui/input';

type DiemDanhType = CreateRollCallType;
type DiemDanhVangType = CreateAbsenceType;
interface Props {
	schoolId: number;
	rollCall?: DiemDanhType;
	rollCallDetail?: DiemDanhVangType;
	isOpen: boolean;
	onOpenChange: (value: boolean) => void;
	onSuccess: () => void;
}

export default function RollCallUpsertForm({
	schoolId,
	rollCall,
	rollCallDetail,
	isOpen,
	onOpenChange,
	onSuccess,
}: Props) {
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();

	const form = useForm<CreateRollCallBodyType>({
		resolver: zodResolver(CreateRollCallBody),
		defaultValues: {
			rollCall: {
				weekId: rollCall?.weekId,
				classId: rollCall?.classId,
				dayOfTheWeek: rollCall?.dayOfTheWeek,
				numberOfAttendants: rollCall?.numberOfAttendants ?? 0,
				dateAt: rollCall?.dateAt ? new Date(rollCall.dateAt) : undefined,
			},
			absences: [], // default empty array
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'absences',
	});

	const handleCreate = async (values: CreateRollCallBodyType) => {
		setLoading(true);
		try {
			const { payload } = await rollcallApiRequest.create(values);
			toast({ description: payload.message });
			if (onSuccess) onSuccess();
		} catch (error: any) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	async function onSubmit(values: CreateRollCallBodyType) {
		if (loading) return;
		if (!rollCall) await handleCreate(values);
		console.log('Form Data:', values);
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
							name='rollCall.weekId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tuần học</FormLabel>
									<FormControl>
										<WeekSelect
											selectedWeekId={field.value}
											onSelectWeek={(key) => field.onChange(key)}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='rollCall.classId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Lớp học</FormLabel>
									<FormControl>
										<LopHocSelect
											selectedSchoolId={schoolId}
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
							name='rollCall.dayOfTheWeek'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Ngày học</FormLabel>
									<FormControl>
										<DayOfTheWeek
											value={field.value}
											onChange={(day) => field.onChange(day)}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='rollCall.dateAt'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Trường học</FormLabel>
									<FormControl>
										<Input
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
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
