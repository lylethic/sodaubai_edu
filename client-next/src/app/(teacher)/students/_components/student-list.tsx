'use client';

import { studentApiRequest } from '@/apiRequests/student';
import { useAppContext } from '@/app/app-provider';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { handleErrorApi } from '@/lib/utils';
import { StudentListResType } from '@/schemaValidations/student.schema';
import { PlusCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Props {
	isOpen?: boolean;
	classId: number;
	schoolId?: number;
	onOpenChange?: (value: boolean) => void;
	onSelectStudents?: (selected: number[]) => void;
}

export default function StudentList({
	isOpen,
	classId,
	schoolId,
	onOpenChange,
	onSelectStudents,
}: Props) {
	const [loading, setLoading] = useState(false);
	const [students, setStudents] = useState<StudentListResType['data']>([]);
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [totalPageCount, setTotalPageCount] = useState<number>(0);
	const [selectedStudent, setSelectedStudent] = useState<number[]>([]);

	const handleCheckboxChange = (id: number) => {
		const updated = selectedStudent.includes(id)
			? selectedStudent.filter((accountId) => accountId !== id)
			: [...selectedStudent, id];

		setSelectedStudent(updated);
		onSelectStudents?.(updated);
	};

	const handleSelectAll = () => {
		let updated: number[] = [];

		if (selectedStudent.length === students.length) {
			updated = [];
		} else {
			updated = students.map((key) => key.studentId);
		}

		setSelectedStudent(updated);
		onSelectStudents?.(updated);
	};

	const fetchData = async (schoolId: number, classId: number) => {
		if (loading) return;
		setLoading(true);

		try {
			const response = await studentApiRequest.studentsByClass(
				Number(schoolId),
				Number(classId)
			);

			const { data, pagination } = response.payload;
			const results = Array.isArray(data) ? data : [];
			const totalResults = pagination.totalResults;

			setStudents(results);
			setTotalPageCount(totalResults ? Math.ceil(totalResults) : 0);
		} catch (error: any) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (schoolId && classId) {
			fetchData(schoolId, classId);
		}
	}, [schoolId, classId]);

	return (
		<div>
			<Dialog open={isOpen} onOpenChange={onOpenChange} modal={true}>
				<DialogTrigger asChild>
					<Button
						variant={'default'}
						className='bg-green-600 text-white font-semibold my-4'
					>
						<PlusCircle />
						Điểm danh
					</Button>
				</DialogTrigger>
				<DialogContent
					className='max-w-screen-xl max-h-[80vh] overflow-y-auto'
					aria-describedby='dialog-description'
				>
					<DialogHeader>
						<DialogTitle>Điểm danh</DialogTitle>
					</DialogHeader>
					{students.length > 0 ? (
						<Table className='w-full table-auto border-collapse min-w-[1000px] my-4 rounded-lg border'>
							<TableHeader className='border-b text-left text-gray-400'>
								<TableRow>
									<TableHead scope='col' className='ps-4 py-3'>
										<Checkbox
											onCheckedChange={handleSelectAll}
											checked={selectedStudent.length === students.length}
										/>
									</TableHead>
									<TableHead scope='col' className='px-2'>
										STT
									</TableHead>
									<TableHead scope='col' className='px-2'>
										Mã học sinh
									</TableHead>
									<TableHead scope='col' className='px-2'>
										Họ và tên
									</TableHead>
									<TableHead scope='col' className='px-2'>
										Có phép
									</TableHead>
									<TableHead scope='col' className='px-2'>
										Ghi chú
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{students.map((item, index) => (
									<TableRow key={item.studentId}>
										<TableCell>
											<Input
												type='checkbox'
												className='w-4 h-4 ms-2'
												onChange={() => handleCheckboxChange(item.studentId)}
												checked={selectedStudent.includes(item.studentId)}
											/>
										</TableCell>
										<TableCell>
											{index + 1 + (pageNumber - 1) * pageSize}
										</TableCell>
										<TableCell>{item.studentId}</TableCell>
										<TableCell>{item.fullname}</TableCell>
										<TableCell>
											<Select>
												<SelectTrigger>
													<SelectValue placeholder='Chọn phép...' />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value='true'>Có</SelectItem>
													<SelectItem value='false'>Không</SelectItem>
												</SelectContent>
											</Select>
										</TableCell>
										<TableCell>
											<Textarea rows={3} placeholder='Ghi chú...' />
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					) : (
						<>!</>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
