'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { formatDateToDDMMYYYY, handleErrorApi } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/app/app-provider';
import { QueryType } from '@/types/queryType';

export default function SoDaiBaiReportList() {
	const router = useRouter();
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [totalPageCount, setTotalPageCount] = useState<number>(0);
	const [selected, setSelected] = useState<number[]>([]);

	return <div></div>;
}
