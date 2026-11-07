'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { handleErrorApi } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { QueryType } from '@/types/queryType';
import DataTable from '@/app/(admin)/_components/data-table';
import biaSoDauBaiApiRequest from '@/apiRequests/biasodaubai';
import {
	BiaSoDauBaiDto,
	BiaSoDauBaiResType,
	normalizeBiaSoDauBai,
} from '@/schemaValidations/biaSoDauBai.schema';
import { getBiaSoDauBaisColumns } from './columns';
import SodauBaiSearchForm from './search-sodaubai-form';
import { useAppContext } from '@/app/app-provider';

type BiaSoDauBaiType = BiaSoDauBaiDto;

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

				const rawData: any = payload?.data;
				const rawItems: any[] = Array.isArray(rawData)
					? rawData
					: (rawData?.items ?? []);
				const totalResults =
					rawData?.totalCount ?? (payload as any).pagination?.totalResults ?? rawItems.length;

				setTotalPageCount(totalResults ? Math.ceil(totalResults / pageSize) : 0);
				setBiaSoDauBaisBySchoolClass(rawItems.map(normalizeBiaSoDauBai));
			} else {
				const { payload } = await biaSoDauBaiApiRequest.getAllBiaBySchool(
					query.pageNumber,
					query.pageSize,
					schoolId
				);

				const rawData: any = payload?.data;
				const rawItems: any[] = Array.isArray(rawData)
					? rawData
					: (rawData?.items ?? []);
				const totalResults =
					rawData?.totalCount ?? (payload as any).pagination?.totalResults ?? rawItems.length;

				setTotalPageCount(
					totalResults ? Math.ceil(totalResults / (query.pageSize || pageSize)) : 1
				);
				setBiaSoDauBais(rawItems.map(normalizeBiaSoDauBai));
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
				schoolId={user.schoolId ?? 0}
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
