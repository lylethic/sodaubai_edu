'use client';

import React, { useEffect, useState } from 'react';
import accountApiRequest from '@/apiRequests/account';
import { useAppContext } from '@/app/app-provider';
import { PaginationWithLinks } from '@/components/pagination-with-links';
import { handleErrorApi } from '@/lib/utils';
import { AccountType } from '@/types/accountType';
import Link from 'next/link';
import { SearchForm } from './search-form';
import DeleteAccount from './delete-account';
import BulkDeleteAccount from './delete-bulk';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import AccountUploadButton from './account-upload';
import FilterAccountBySchool from './filter-account-by-schoolId';

export default function AccountList() {
	const { user } = useAppContext();
	const [loading, setLoading] = useState(false);
	const [accounts, setAccounts] = useState<AccountType[]>([]);
	const [searchAccounts, setSearchAccounts] = useState<AccountType[]>([]);
	const [selectedAccounts, setSelectedAccounts] = useState<number[]>([]);

	const [totalPageCount, setTotalPageCount] = useState<number>(0);
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);

	const role = Number(user?.roleId);
	const [selectedSchoolId, setSelectedSchoolId] = useState<number>(0);

	const handleFilterChange = (schoolId: number | null) => {
		setSelectedSchoolId(schoolId ?? 0);
		setPageNumber(1);
	};

	const fetchAccounts = async (
		pageNumber: number,
		pageSize: number,
		school?: number | null
	) => {
		if (loading) return;
		setLoading(true);

		try {
			const response = await accountApiRequest.accounts(
				pageNumber,
				pageSize,
				school
			);

			const { data, pagination } = response.payload;
			const results = Array.isArray(data) ? data : [];
			const totalResults = pagination.totalResults;

			setAccounts(results);
			setTotalPageCount(totalResults ? Math.ceil(totalResults) : 0);
		} catch (error: any) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	const handleSearchResults = (
		results: AccountType[],
		totalResults: number
	) => {
		setSearchAccounts(results);
	};

	const handleCheckboxChange = (id: number) => {
		setSelectedAccounts((prev) =>
			prev.includes(id)
				? prev.filter((accountId) => accountId !== id)
				: [...prev, id]
		);
	};

	// select all
	const handleSelectAll = () => {
		if (selectedAccounts.length === accounts.length) {
			setSelectedAccounts([]); // Deselect all
		} else {
			setSelectedAccounts(accounts.map((account) => account.accountId)); // Select all
		}
	};

	// Check and filter accounts have not deleted
	const handleDeleteSuccess = (deletedIds: number[]) => {
		setAccounts((prevAccounts) =>
			prevAccounts.filter((account) => !deletedIds.includes(account.accountId))
		);
		setSelectedAccounts([]);
	};

	// Delete 1 record
	const handleDeleteAccount = (accountId: number) => {
		setAccounts((prevAccounts) =>
			prevAccounts.filter((account) => account.accountId !== accountId)
		);
	};

	useEffect(() => {
		if (searchAccounts.length === 0) {
			fetchAccounts(pageNumber, pageSize, selectedSchoolId);
		}
	}, [pageNumber, pageSize, selectedSchoolId]);

	return (
		<>
			<AccountUploadButton />
			{role === 6 || role === 7 ? (
				<SearchForm
					onSearchResults={handleSearchResults}
					pageNumber={pageNumber}
					pageSize={pageSize}
				/>
			) : (
				<SearchForm
					school={selectedSchoolId}
					onSearchResults={handleSearchResults}
					pageNumber={pageNumber}
					pageSize={pageSize}
				/>
			)}

			<FilterAccountBySchool
				schoolId={selectedSchoolId}
				onFilterChange={handleFilterChange}
				onReset={() => setSelectedSchoolId(0)}
			/>

			<BulkDeleteAccount
				selected={selectedAccounts}
				onDeleted={handleDeleteSuccess}
			/>
			{searchAccounts.length > 0 ? (
				<div className='relative overflow-x-auto shadow-md'>
					<Table className='w-full table-auto border-collapse min-w-[1000px] my-4 rounded-lg border'>
						<TableHeader className='border-b text-left text-gray-400'>
							<TableRow>
								<TableHead scope='col' className='ps-4 py-3'>
									<Checkbox
										onCheckedChange={handleSelectAll}
										checked={selectedAccounts.length === accounts.length}
									/>
								</TableHead>
								<TableHead scope='col' className='px-2'>
									STT
								</TableHead>
								<TableHead scope='col' className='px-2'>
									Mã tài khoản
								</TableHead>
								<TableHead scope='col' className='px-2'>
									Vai trò
								</TableHead>
								<TableHead scope='col' className='px-2'>
									Email
								</TableHead>
								<TableHead scope='col' className='px-2'>
									Trường học
								</TableHead>
								<TableHead scope='col' className='px-2'>
									Ngày tạo
								</TableHead>
								<TableHead scope='col' className='px-2'>
									Ngày cập nhật
								</TableHead>
								<TableHead scope='col' className='px-2'>
									Chức năng
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{searchAccounts.map((item, index) => (
								<TableRow key={item.accountId}>
									<TableCell>
										<Input
											type='checkbox'
											className='w-4 h-4 ms-2'
											onChange={() => handleCheckboxChange(item.accountId)}
											checked={selectedAccounts.includes(item.accountId)}
										/>
									</TableCell>
									<TableCell>
										{index + 1 + (pageNumber - 1) * pageSize}
									</TableCell>
									<TableCell>{item.accountId}</TableCell>
									<TableCell>{item.roleName}</TableCell>
									<TableCell>{item.email}</TableCell>
									<TableCell>{item.schoolName}</TableCell>
									<TableCell>
										{item.dateCreated
											? format(new Date(item.dateCreated), 'dd/MM/yyyy')
											: ''}
									</TableCell>
									<TableCell>
										{item.dateUpdated
											? format(new Date(item.dateUpdated), 'dd/MM/yyyy')
											: ''}
									</TableCell>
									<TableCell>
										<div className='flex flex-col sm:flex-row justify-evenly items-center gap-2'>
											<Link
												href={`/dashboard/accounts/${item.accountId}`}
												title='Chi tiết'
												className='bg-green-500 text-white p-2 rounded'
											>
												Chi tiết
											</Link>
											<Link
												href={`/dashboard/accounts/${item.accountId}/edit`}
												title='Sửa'
												className='bg-yellow-500 text-white p-2 rounded'
											>
												Sửa
											</Link>
											<DeleteAccount
												account={item}
												onDelete={handleDeleteAccount}
											/>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			) : (
				<div className='relative overflow-x-auto shadow-md'>
					<Table className='w-full table-auto border-collapse min-w-[1000px] my-4 rounded-lg border'>
						<TableHeader className='border-b text-left text-gray-400'>
							<TableRow>
								<TableHead scope='col' className='ps-4 py-3'>
									<Checkbox
										onCheckedChange={handleSelectAll}
										checked={selectedAccounts.length === accounts.length}
									/>
								</TableHead>
								<TableHead>STT</TableHead>
								<TableHead>Mã tài khoản</TableHead>
								<TableHead>Vai trò</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Trường học</TableHead>
								<TableHead>Ngày tạo</TableHead>
								<TableHead>Ngày cập nhật</TableHead>
								<TableHead>Chức năng</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{accounts.map((item, index) => (
								<TableRow key={item.accountId}>
									<TableCell>
										<div className='flex items-center'>
											<Input
												id='checkbox-table-search-1'
												type='checkbox'
												className='w-4 h-4 ms-2'
												onChange={() => handleCheckboxChange(item.accountId)}
												checked={selectedAccounts.includes(item.accountId)}
											/>
											<Label
												htmlFor='checkbox-table-search-1'
												className='sr-only'
											>
												checkbox
											</Label>
										</div>
									</TableCell>
									<TableCell>
										{index + 1 + (pageNumber - 1) * pageSize}
									</TableCell>
									<TableCell>{item.accountId}</TableCell>
									<TableCell>{item.roleName}</TableCell>
									<TableCell>{item.email}</TableCell>
									<TableCell>{item.schoolName}</TableCell>
									<TableCell>
										{item.dateCreated
											? format(new Date(item.dateCreated), 'dd/MM/yyyy')
											: ''}
									</TableCell>
									<TableCell>
										{item.dateUpdated
											? format(new Date(item.dateUpdated), 'dd/MM/yyyy')
											: ''}
									</TableCell>
									<TableCell className='p-2 text-center'>
										<div className='flex flex-col sm:flex-row justify-evenly items-center gap-2'>
											<Link
												href={`/dashboard/accounts/${item.accountId}`}
												title='Chi tiết'
												className='bg-green-500 text-white p-2 rounded'
											>
												Chi tiết
											</Link>
											<Link
												href={`/dashboard/accounts/${item.accountId}/edit`}
												title='Sửa'
												className='bg-yellow-500 text-white p-2 rounded'
											>
												Sửa
											</Link>
											<DeleteAccount
												account={item}
												onDelete={handleDeleteAccount}
											/>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					<PaginationWithLinks
						page={pageNumber}
						pageSize={pageSize}
						totalCount={totalPageCount}
						onPageChange={(newPage) => setPageNumber(newPage)}
						onPageSizeChange={(newSize) => setPageSize(newSize)}
						pageSizeSelectOptions={{ pageSizeOptions: [5, 10, 20, 50] }}
					/>
				</div>
			)}
		</>
	);
}
