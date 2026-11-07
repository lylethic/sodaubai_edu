import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { GradeSchemaType } from '@/schemaValidations/grade.schema';
import { gradeApiRequest } from '@/apiRequests/grade';
import { QueryType } from '@/types/queryType';

interface GradeSelectProps {
	selectedGradeId: number | null;
	onSelectedGrade: (gradeId: number) => void;
}

function GradeSelect({ selectedGradeId, onSelectedGrade }: GradeSelectProps) {
	const [grades, setGrades] = useState<GradeSchemaType[]>([]);
	const { setValue } = useFormContext();
	useEffect(() => {
		const fetchGradeList = async (queryObject: QueryType) => {
			try {
				const response = await gradeApiRequest.grades(queryObject);
				const data = response.payload.data;
				const result = (data as any)?.items || (Array.isArray(data) ? data : []);
				setGrades(result);
			} catch (error) {}
		};
		fetchGradeList({ pageNumber: 1, pageSize: 20 });
	}, []);

	const selectedItem = grades.find(
		(item) => (item.gradeId || item.id) === selectedGradeId
	);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' className='w-full justify-between'>
					{selectedItem?.gradeName ||
						selectedItem?.name ||
						'Chọn khối lớp...'}
					<ChevronsUpDown className='ml-2 h-4 w-4 opacity-50' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-full max-h-60 overflow-y-auto'>
				{grades.map((key) => {
					const id = key.gradeId || key.id || 0;
					const name = key.gradeName || key.name || '';
					return (
						<DropdownMenuItem
							key={id}
							onClick={() => {
								onSelectedGrade(id);
								setValue('gradeId', id);
							}}
						>
							<Check
								className={cn(
									'mr-2 h-4 w-4',
									id === selectedGradeId ? 'opacity-100' : 'opacity-0'
								)}
							/>
							<div className='w-full flex items-center justify-between'>
								{name}
							</div>
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default GradeSelect;
