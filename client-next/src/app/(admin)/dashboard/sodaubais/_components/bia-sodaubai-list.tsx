'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { handleErrorApi } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { QueryType } from '@/types/queryType';
import DataTable from '@/app/(admin)/_components/data-table';
import BulkDeleteBiaSoDauBai from '@/app/(admin)/_components/bulk-delete-sodaubai';
import biaSoDauBaiApiRequest from '@/apiRequests/biasodaubai';
import {
	BiaSoDauBaiDto,
	BiaSoDauBaiResType,
	normalizeBiaSoDauBai,
} from '@/schemaValidations/biaSoDauBai.schema';
import { getBiaSoDauBaisColumns } from './columns';
import SodauBaiAddButton from './sodaubai-add-button';
import SodauBaiSearchForm from './search-sodaubai-form';

type BiaSoDauBaiType = BiaSoDauBaiDto;

interface FilterProps {
	filters?: {
		schoolId: number | null;
		classId: number | null;
	};
}

export default function SoDauBaiListPage({ filters }: FilterProps) {
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
	const [selectedSchool, setSelectedSchool] = useState<number>(0);
	const [selectedClass, setSelectedClass] = useState<number>(0);

	const handleFilterChange = (updatedFilters: FilterProps['filters']) => {
		setSelectedSchool(updatedFilters?.schoolId ?? 0);
		setSelectedClass(updatedFilters?.classId ?? 0);
		setPageNumber(1);
	};

	const fetchData = async (query: QueryType) => {
		setLoading(true);
		try {
			if (selectedSchool) {
				// fetch data by schoolId: require || classId: optional
				const response = await biaSoDauBaiApiRequest.getAllBiaBySchoolClass(
					pageNumber,
					pageSize,
					selectedSchool,
					selectedClass ?? null // Pass null if no class is selected.
				);
				const rawData: any = response.payload?.data;
				const rawItems: any[] = Array.isArray(rawData)
					? rawData
					: (rawData?.items ?? []);
				const totalResults =
					rawData?.totalCount ?? (response.payload as any).pagination?.totalResults ?? rawItems.length;

				// Update state
				setTotalPageCount(totalResults ? Math.ceil(totalResults / pageSize) : 0);
				setBiaSoDauBaisBySchoolClass(rawItems.map(normalizeBiaSoDauBai));
			} else {
				const [countResponse, dataResponse] = await Promise.all([
					biaSoDauBaiApiRequest.countBiaSoDauBai(),
					biaSoDauBaiApiRequest.getAllBiaAdmin(query),
				]);

				const totalCount = countResponse.payload;
				const rawData: any = dataResponse.payload.data;
				const rawItems: any[] = Array.isArray(rawData)
					? rawData
					: (rawData?.items ?? []);
				const actualTotal =
					totalCount || rawData?.totalCount || rawItems.length;

				setTotalPageCount(
					actualTotal ? Math.ceil(actualTotal / (query.pageSize || pageSize)) : 0
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
	}, [selectedSchool, selectedClass, pageNumber, pageSize]);

	const handleResetFilters = () => {
		setSelectedSchool(0);
		setSelectedClass(0);
		setBiaSoDauBaisBySchoolClass([]);
	};

	const handleEdit = useCallback(
		(data: BiaSoDauBaiType) =>
			router.push(`/dashboard/sodaubais/${data.biaSoDauBaiId}/edit`),
		[]
	);

	const handleRedirectToChiTietSoDauBai = useCallback(
		(data: BiaSoDauBaiType) =>
			router.push(`/dashboard/sodaubais/${data.biaSoDauBaiId}/chitietsodaubai`),
		[]
	);

	// delete 1 biaSoDauBai
	const handleDelete = useCallback((data: BiaSoDauBaiType) => {
		const deleteBiaSoDauBai = async () => {
			try {
				const response = await biaSoDauBaiApiRequest.delete(data.biaSoDauBaiId);
				toast({
					description: response.payload.message,
				});

				setBiaSoDauBais((prev) =>
					prev.filter((item) => item.biaSoDauBaiId !== data.biaSoDauBaiId)
				);

				setBiaSoDauBaisBySchoolClass((prev) =>
					prev.filter((item) => item.biaSoDauBaiId !== data.biaSoDauBaiId)
				);
			} catch (error) {
				handleErrorApi({ error });
			}
		};

		deleteBiaSoDauBai();
	}, []);

	const handleRedirectToDetail = useCallback(
		(data: BiaSoDauBaiType) =>
			router.push(`/dashboard/sodaubais/${data.biaSoDauBaiId}`),
		[]
	);

	const handleRefresh = useCallback(() => {
		fetchData({ pageNumber, pageSize });
	}, [pageNumber, pageSize]);

	const columns = useMemo(
		() =>
			getBiaSoDauBaisColumns({
				handleEdit,
				handleDelete,
				handleRedirectToDetail,
				handleRedirectToChiTietSoDauBai,
			}),
		[]
	);

	return (
		<div className='mt-4'>
			<SodauBaiAddButton onSuccess={handleRefresh} />

			<SodauBaiSearchForm
				initialFilters={filters}
				onFilterChange={handleFilterChange}
				onReset={handleResetFilters}
			/>

			<BulkDeleteBiaSoDauBai
				selected={selected.map((key) => key.biaSoDauBaiId)}
				onSuccess={() => fetchData({ pageNumber, pageSize })}
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
