'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { handleErrorApi } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { QueryType } from '@/types/queryType';
import DataTable from '@/app/(admin)/_components/data-table';
import biaSoDauBaiApiRequest from '@/apiRequests/biasodaubai';
import { BiaSoDauBaiResType } from '@/schemaValidations/biaSoDauBai.schema';
import { getBiaSoDauBaisColumns } from './columns';
import SodauBaiSearchForm from './search-sodaubai-form';
import { useAppContext } from '@/app/app-provider';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ListTodo } from 'lucide-react';

type BiaSoDauBaiType = BiaSoDauBaiResType['data'];

export default function SoDauBaiListPage() {
	const { user } = useAppContext();
	const { toast } = useToast();
	const router = useRouter();

	const [loading, setLoading] = useState(false);
	const [biaSoDauBais, setBiaSoDauBais] = useState<BiaSoDauBaiType[]>([]);
	const [biaSoDauBaisBySchoolClass, setBiaSoDauBaisBySchoolClass] = useState<
		BiaSoDauBaiType[]
	>([]);
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [totalPageCount, setTotalPageCount] = useState<number>(0);
	const [selected, setSelected] = useState<BiaSoDauBaiType[]>([]);
	const [selectedClass, setSelectedClass] = useState<number>(0);

	const handleFilterChange = (classId: number | null) => {
		setSelectedClass(classId ?? 0);
		setPageNumber(1);
	};

	const schoolId = user?.schoolId || 1;

	const fetchData = async (query: QueryType) => {
		setLoading(true);
		try {
			if (selectedClass) {
				const { payload } = await biaSoDauBaiApiRequest.getAllBiaBySchoolClass(
					pageNumber,
					pageSize,
					schoolId,
					selectedClass ?? null
				);

				if (!Array.isArray(payload.data) || payload.data.length === 0) {
					toast({ description: payload.message });
				}

				const result = payload?.data;
				const totalResults = payload.pagination?.totalResults;

				setTotalPageCount(totalResults ? Math.ceil(totalResults) : 0);
				setBiaSoDauBaisBySchoolClass(Array.isArray(result) ? result : []);
			} else {
				const { payload } = await biaSoDauBaiApiRequest.getAllBiaBySchool(
					query.pageNumber,
					query.pageSize,
					schoolId
				);

				const data = payload.data;
				const totalResults = payload.pagination?.totalResults;

				setTotalPageCount(totalResults ? Math.ceil(totalResults) : 1);
				setBiaSoDauBais(Array.isArray(data) ? data : []);
			}
		} catch (error: any) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (loading) return;
		fetchData({ pageNumber, pageSize });
	}, [selectedClass, pageNumber, pageSize]);

	const handleResetFilters = () => {
		setSelectedClass(0);
		setBiaSoDauBaisBySchoolClass([]);
	};

	const handleRedirectToChiTietSoDauBai = useCallback(
		(data: BiaSoDauBaiType) =>
			router.push(`/sodaubai/${data.biaSoDauBaiId}/chitietsodaubai`),
		[]
	);

	const handleRedirectToDetail = useCallback(
		(data: BiaSoDauBaiType) => router.push(`/sodaubai/${data.biaSoDauBaiId}`),
		[]
	);

	const columns = useMemo(
		() =>
			getBiaSoDauBaisColumns({
				handleRedirectToDetail,
				handleRedirectToChiTietSoDauBai,
			}),
		[]
	);

	if (!user) return null;

	return (
		<div className='mt-4'>
			<SodauBaiSearchForm
				schoolId={user.schoolId}
				classId={selectedClass}
				onFilterChange={handleFilterChange}
				onReset={handleResetFilters}
			/>

			<DataTable
				columns={columns}
				data={
					biaSoDauBaisBySchoolClass.length > 0
						? biaSoDauBaisBySchoolClass
						: biaSoDauBais
				}
				pageNumber={pageNumber}
				pageSize={pageSize}
				totalCount={totalPageCount}
				onPageChange={setPageNumber}
				onPageSizeChange={setPageSize}
				onSelectedRowsChange={setSelected}
			/>
		</div>
	);
}
