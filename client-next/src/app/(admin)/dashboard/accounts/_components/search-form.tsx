'use client';

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
import { useEffect, useState } from 'react';
import accountApiRequest from '@/apiRequests/account';
import { handleErrorApi } from '@/lib/utils';
import { AccountType } from '@/types/accountType';
import { useDebounce } from '@/hooks/debounce-hooks-custom';
import { QueryType } from '@/types/queryType';

interface SearchFormProps {
	school?: number;
	pageSize: number;
	pageNumber: number;
	onSearchResults: (results: AccountType[], totalResults: number) => void;
}

export function SearchForm({
	school,
	onSearchResults,
	pageNumber,
	pageSize,
}: SearchFormProps) {
	const [loading, setLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const debouncedQuery = useDebounce(searchQuery);

	const form = useForm<z.infer<typeof SearchUserSchema>>({
		resolver: zodResolver(SearchUserSchema),
		defaultValues: {
			name: '',
		},
	});

	const { resetField, setValue } = form;

	const handleSearch = async (query: string, queryObject: QueryType) => {
		if (loading || !query.trim()) return;
		setLoading(true);
		// onSearchResults([], { totalPages: 0, totalResults: 0 });
		try {
			// await new Promise((resolve) => setTimeout(resolve, 1000));
			const response = await accountApiRequest.relativeSearchAccounts(
				queryObject.pageNumber,
				queryObject.pageSize,
				school,
				query
			);
			const { data, pagination } = response.payload;
			const result = Array.isArray(data) ? data : [];
			const totalResults = pagination.totalResults;

			if (data) onSearchResults(result, totalResults);
		} catch (error: any) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const loadAccounts = async () => {
			if (!debouncedQuery.trim()) {
				onSearchResults([], 0);
				return;
			}
			await handleSearch(debouncedQuery, { pageNumber, pageSize });
		};
		loadAccounts();
		// Only trigger when debouncedQuery or pagination changes
		// Prevent duplicate calls when switching between pages
	}, [debouncedQuery, pageNumber, pageSize]);
	// console.log('pageNumber, pageSize: ', pageNumber + ' - ' + pageSize);

	useEffect(() => {
		if (searchQuery.trim() !== '') {
			onSearchResults([], 0);
		}
	}, [debouncedQuery]);

	// Handle cancel
	const handleCancel = () => {
		setSearchQuery('');
		setValue('name', '');
		resetField('name');
		onSearchResults([], 0);
	};

	return (
		<div className='flex flex-col p-6 rounded-xl border my-2 w-full'>
			<Form {...form}>
				<form
				// onSubmit={form.handleSubmit(onSubmit)}
				>
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Tìm kiếm</FormLabel>
								<FormControl>
									<Input
										placeholder='Tìm kiếm theo email...'
										aria-label='Tìm kiếm theo email...'
										{...field}
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										disabled={loading}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						className='mt-4'
						variant={'default'}
						type='button'
						onClick={handleCancel}
					>
						{loading ? 'Đang tìm kiếm...' : 'Hủy tìm kiếm'}
					</Button>
				</form>
			</Form>
		</div>
	);
}
