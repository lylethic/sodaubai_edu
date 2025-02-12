'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import { SearchUserSchema } from '@/types/searchObjectType';
import { handleErrorApi } from '@/lib/utils';
import teacherApiRequest from '@/apiRequests/teacher';
import { TeacherResType } from '@/schemaValidations/teacher.schema';
import { QueryType } from '@/types/queryType';

interface SearchFormProps {
	school?: number;
	onSearchResults: (
		results: TeacherResType['data'][],
		totalResults: number
	) => void;
	onReset: () => void;
}

export function SearchTeacherForm({
	school,
	onSearchResults,
	onReset,
}: SearchFormProps) {
	const [loading, setLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [debouncedQuery, setDebouncedQuery] = useState('');

	const form = useForm<z.infer<typeof SearchUserSchema>>({
		resolver: zodResolver(SearchUserSchema),
		defaultValues: {
			name: '',
		},
	});

	const { resetField, setValue } = form;

	const handleSearch = async (query: string) => {
		if (loading || !query.trim()) return;
		setLoading(true);
		try {
			const response = await teacherApiRequest.relativeSearchTeachers(
				1,
				20,
				school,
				query
			);

			const { data, pagination } = response.payload;
			const accountsArray = Array.isArray(data) ? data : [data];

			onSearchResults(accountsArray, pagination.totalResults);
		} catch (error: any) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	// Debounce input
	useEffect(() => {
		const handler = setTimeout(() => setDebouncedQuery(searchQuery), 1000);
		return () => clearTimeout(handler);
	}, [searchQuery]);

	// Trigger search on debounced query change or when pageNumber/pageSize changes
	useEffect(() => {
		if (debouncedQuery) {
			handleSearch(debouncedQuery);
		}
	}, [debouncedQuery]);

	const handleCancel = () => {
		if (onReset) onReset();
		setSearchQuery('');
		setValue('name', '');
		resetField('name');
		onSearchResults([], 0);
	};

	return (
		<div className='flex flex-col p-6 rounded-xl border my-2 w-full'>
			<Form {...form}>
				<form>
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Tìm kiếm</FormLabel>
								<FormControl>
									<Input
										placeholder='Tìm kiếm theo tên...'
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						variant={'default'}
						type='button'
						onClick={handleCancel}
						disabled={loading}
						className='mt-4'
					>
						Hủy tìm kiếm
					</Button>
				</form>
			</Form>
		</div>
	);
}
