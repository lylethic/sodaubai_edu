import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Ban, Check, ChevronsUpDown } from 'lucide-react';
import { cn, handleErrorApi } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { QueryType } from '@/types/queryType';
import { BiaSoDauBaiResType } from '@/schemaValidations/biaSoDauBai.schema';
import biaSoDauBaiApiRequest from '@/apiRequests/biasodaubai';

interface SoDauBaiSelectProps {
	selectedSoDauBaiId: number;
	selectedSchoolId: number;
	onSelectedSoDauBai: (biaSoDauBaiId: number) => void;
}

function SoDauBaiSelect({
	selectedSchoolId,
	selectedSoDauBaiId,
	onSelectedSoDauBai,
}: SoDauBaiSelectProps) {
	const [sodaubais, setSoDauBais] = useState<BiaSoDauBaiResType['data'][]>([]);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const latestPageRef = useRef(1);
	const { setValue } = useFormContext();

	const fetchSoDauBais = async (page: QueryType, schoolId: number) => {
		if (loading || !hasMore || latestPageRef.current === page.pageSize) return;

		setLoading(true);
		latestPageRef.current === page.pageSize;
		try {
			const { payload } = await biaSoDauBaiApiRequest.getAllBiaBySchoolSelect(
				page.pageNumber,
				page.pageSize,
				schoolId
			);
			const result = Array.isArray(payload.data) ? payload.data : [];
			setSoDauBais((prev) => [...prev, ...result]);
			setHasMore(result.length > 0); // Stop if no more data
		} catch (error) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setSoDauBais([]); // Reset list when schoolId changes
		setPage(1);
		setHasMore(true);
		latestPageRef.current = 1;
		fetchSoDauBais({ pageNumber: page, pageSize: 20 }, selectedSchoolId);
	}, [selectedSchoolId]);

	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const bottom =
			e.currentTarget.scrollHeight - e.currentTarget.scrollTop <=
			e.currentTarget.clientHeight;
		if (bottom && hasMore && !loading) {
			const nextPage = page + 1;
			setPage(nextPage);
			fetchSoDauBais({ pageNumber: nextPage, pageSize: 20 }, selectedSchoolId);
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' className='w-full justify-between'>
					{sodaubais.find((item) => item.biaSoDauBaiId === selectedSoDauBaiId)
						?.className || 'Chọn lớp...'}
					<ChevronsUpDown className='ml-2 h-4 w-4 opacity-50' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className='w-full max-h-60 overflow-y-auto'
				onScroll={handleScroll}
			>
				{sodaubais.map((key) => (
					<DropdownMenuItem
						key={key.biaSoDauBaiId}
						onClick={() => {
							onSelectedSoDauBai(key.biaSoDauBaiId);
							setValue('biaSoDauBaiId', key.biaSoDauBaiId);
						}}
					>
						<Check
							className={cn(
								'mr-2 h-4 w-4',
								key.biaSoDauBaiId === selectedSoDauBaiId
									? 'opacity-100'
									: 'opacity-0'
							)}
						/>
						<div className='w-full flex items-center justify-between'>
							{key.className}
							<Ban
								color='red'
								className={cn(
									'ml-2 h-4 w-4',
									key.status === false ? 'opacity-100' : 'opacity-0'
								)}
							/>
						</div>
					</DropdownMenuItem>
				))}
				{loading && <p className='text-center p-2'>Loading...</p>}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default SoDauBaiSelect;
