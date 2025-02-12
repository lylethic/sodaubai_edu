'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import DataTable from '../../../_components/data-table';
import { getTeacherscolumns } from './columns';
import { handleErrorApi } from '@/lib/utils';
import { useAppContext } from '@/app/app-provider';
import { TeacherResType } from '@/schemaValidations/teacher.schema';
import teacherApiRequest from '@/apiRequests/teacher';
import { QueryType } from '@/types/queryType';
import { useToast } from '@/hooks/use-toast';
import { SearchTeacherForm } from './search-teacher-form';
import { useRouter } from 'next/navigation';
import BulkDeleteTeacher from './bulk-delete';
import FilterAccountBySchool from '../../accounts/_components/filter-account-by-schoolId';
import DataTableNoPagination from '@/app/(admin)/_components/data-table-no-pagination';

type TeacherType = TeacherResType['data'];

export function TeacherList() {
	const { user } = useAppContext();
	const router = useRouter();

	const [loading, setLoading] = useState(false);
	const [teachers, setTeachers] = useState<TeacherType[]>([]);
	const [searchTeachers, setSearchTeachers] = useState<TeacherType[]>([]);
	const [selectedTeacherIds, setSelectedTeacherIds] = useState<TeacherType[]>(
		[]
	);
	const [selectedSchoolId, setSelectedSchoolId] = useState<number>(0);

	const [pageNumber, setPageNumber] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const [totalPageCount, setTotalPageCount] = useState<number>(0);
	const { toast } = useToast();

	const fetchTeachers = async (query: QueryType, school?: number) => {
		if (loading) return;
		setLoading(true);

		try {
			const response = await teacherApiRequest.teachersBySchool(query, school);
			const { data, pagination } = response.payload;

			const result = Array.isArray(data) ? data : [];
			const totalResults = pagination.totalResults;

			setTeachers(result);
			setTotalPageCount(totalResults);
		} catch (error: any) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	const handleSearchResults = (
		results: TeacherResType['data'][],
		total: number
	) => {
		setSearchTeachers(results);
	};
	console.log('count: ', totalPageCount);

	const handleReset = useCallback(() => {
		fetchTeachers({ pageNumber, pageSize }, selectedSchoolId);
	}, [pageNumber, pageSize, selectedSchoolId]);

	// See detail teacher
	const handleRedirectToDetail = useCallback(
		(data: TeacherType) => router.push(`/dashboard/teachers/${data.teacherId}`),
		[]
	);

	const handleEdit = useCallback(
		(data: TeacherType) =>
			router.push(`/dashboard/teachers/${data.teacherId}/edit`),
		[]
	);

	// useCallback Kiem soat khong tao ra func moi
	const handleDelete = useCallback((data: TeacherType) => {
		const deleteTeacher = async () => {
			try {
				const response = await teacherApiRequest.delete(data.teacherId);
				toast({
					description: response.payload.message,
				});
				fetchTeachers({ pageNumber, pageSize }, selectedSchoolId);
			} catch (error) {
				handleErrorApi({ error });
			}
		};

		deleteTeacher();
	}, []);

	const handleFilterChange = (schoolId: number | null) => {
		setSelectedSchoolId(schoolId ?? 0);
		setPageNumber(1);
	};

	useEffect(() => {
		fetchTeachers({ pageNumber, pageSize }, selectedSchoolId);
	}, [pageNumber, pageSize, selectedSchoolId]);

	// Kiem tra func co can re-render lai khong, so sanh voi refrence cua useCallback
	const columns = useMemo(
		() =>
			getTeacherscolumns({ handleEdit, handleDelete, handleRedirectToDetail }),
		[]
	);

	return (
		<div>
			<SearchTeacherForm
				onSearchResults={handleSearchResults}
				onReset={handleReset}
			/>
			<FilterAccountBySchool
				schoolId={selectedSchoolId}
				onFilterChange={handleFilterChange}
				onReset={() => setSelectedSchoolId(0)}
			/>
			<BulkDeleteTeacher
				selected={selectedTeacherIds.map((key) => key.teacherId)}
				onDeleteSuccess={() =>
					fetchTeachers({ pageNumber, pageSize }, selectedSchoolId)
				}
			/>

			{searchTeachers && searchTeachers.length > 0 ? (
				<DataTableNoPagination
					columns={columns}
					data={searchTeachers}
					onSelectedRowsChange={setSelectedTeacherIds}
				/>
			) : (
				<DataTable
					columns={columns}
					data={teachers}
					pageNumber={pageNumber}
					pageSize={pageSize}
					totalCount={totalPageCount}
					onPageChange={setPageNumber}
					onPageSizeChange={setPageSize}
					onSelectedRowsChange={setSelectedTeacherIds}
				/>
			)}
		</div>
	);
}
