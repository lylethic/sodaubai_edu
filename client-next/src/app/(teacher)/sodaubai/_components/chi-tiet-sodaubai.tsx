'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAppContext } from '@/app/app-provider';
import {
	handleErrorApi,
	parseDateFromDDMMYYYY,
	normalizeString,
	morningPeriods,
	afternoonPeriods,
} from '@/lib/utils';
import { Edit } from 'lucide-react';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { weekApiRequest } from '@/apiRequests/week';
import teacherApiRequest from '@/apiRequests/teacher';
import { PhanCongMonHocApiRequest } from '@/apiRequests/phanCongMonHoc';
import { DaysOfWeekResType } from '@/schemaValidations/week.schema';
import { ChiTietSoDauBaiResType } from '@/schemaValidations/chiTietSoDauBai.schema';
import chiTietSoDauBaiApiRequest from '@/apiRequests/chiTietSoDauBai';
import FilterChiTietSodauBai from './filter-chi-tiet-sodaubai';
import ChiTietSoDauBaiAddButton from './chi-tiet-so-dau-bai-add-button';
import DeleteChiTietSoDauBai from './chitiet-delete';
import { toast } from '@/hooks/use-toast';
import { addHours, differenceInHours, getDay, parse, parseISO } from 'date-fns';

interface FilterProps {
	filters?: {
		academicYearId: number | null;
		semesterId: number | null;
		weekId: number | null;
	};
}

export default function ChiTietSoDauBai({ filters }: FilterProps) {
	// Id_bia
	const { id } = useParams();
	const { user } = useAppContext();

	const [loading, setLoading] = useState(false);
	const [chiTietSoDauBais, setChiTietSoDauBais] = useState<
		ChiTietSoDauBaiResType['data'][]
	>([]);
	const [daysOfWeek, setDaysOfWeek] = useState<DaysOfWeekResType['data'][]>([]);
	const [selectedWeekId, setSelectedWeekId] = useState<number>(0);
	const [selectedAcademicYearId, setSelectedAcademicYearId] =
		useState<number>(0);
	const [selectedSemesterId, setSelectedSemesterId] = useState<number>(0);
	const [teacherId, setTeacherId] = useState<number>(0);
	const [subjectId, setSubjectId] = useState<number>(0);

	// Filter Props
	const handleFilterChange = (updatedFilters: FilterProps['filters']) => {
		setSelectedAcademicYearId(updatedFilters?.academicYearId ?? 0);
		setSelectedSemesterId(updatedFilters?.semesterId ?? 0);
		setSelectedWeekId(updatedFilters?.weekId ?? 0);
	};

	// api/Get7DaysInWeek?selectedWeekId=WeekId
	useEffect(() => {
		const fetchDaysOfWeek = async (weekId: number | null) => {
			try {
				const response = await weekApiRequest.getDaysOfWeek(weekId);
				const result = Array.isArray(response.payload.data)
					? response.payload.data
					: [response.payload.data];
				setDaysOfWeek(result);
			} catch (error) {
				handleErrorApi({ error });
			}
		};
		fetchDaysOfWeek(selectedWeekId);
	}, [selectedWeekId]);

	// api/ChiTietSoDauBais/get-chi-tiet-by-school?SchoolId=1&AcademicYearId=22&SemesterId=1&WeekId=1&BiaSoDauBaiId=1
	const fetchChiTietSoDauBai = async () => {
		setLoading(true);
		try {
			if (
				!id ||
				!selectedAcademicYearId ||
				!selectedSemesterId ||
				!selectedWeekId
			) {
				return;
			}

			const { payload } = await chiTietSoDauBaiApiRequest.getByAllChiTietsByBia(
				selectedAcademicYearId,
				selectedSemesterId,
				selectedWeekId,
				Number(id)
			);
			const result = payload.data;
			setChiTietSoDauBais(Array.isArray(result) ? result : []);
		} catch (error: any) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	const fetchSubjectId = async () => {
		setLoading(true);
		try {
			const monHoc = await PhanCongMonHocApiRequest.teacherBySubjectAssign(
				teacherId
			);
			setSubjectId(monHoc.payload.data.subjectId);
		} catch (error) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};
	const fetchTeacherIdByAccountId = async () => {
		setLoading(true);
		try {
			if (user) {
				const { payload } = await teacherApiRequest.teacherByAccountId(
					user.accountId
				);
				setTeacherId(payload.data.teacherId);
			}
		} catch (error) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (loading) return;
		fetchChiTietSoDauBai();
		fetchSubjectId();
		fetchTeacherIdByAccountId();
	}, [selectedAcademicYearId, selectedSemesterId, selectedWeekId]);

	return (
		<div>
			<FilterChiTietSodauBai
				initialFilters={filters}
				onFilterChange={handleFilterChange}
			/>
			<div className='relative overflow-x-auto  border-collapse border border-gray-200 rounded'>
				<Table className='w-full table-auto border-collapse min-w-[1000px] my-4'>
					<TableCaption className='border-t p-2'>
						Chi tiết sổ đầu bài
						<span className='capitalize font-medium'>
							{' '}
							tuần {selectedWeekId ? selectedWeekId : ''}
						</span>
					</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className='text-center'>
								Thứ
								<br />
								ngày/tháng
							</TableHead>
							<TableHead className='text-center'>Buổi</TableHead>
							<TableHead className='text-center'>Ghi sổ</TableHead>
							<TableHead className='text-center'>Tiết</TableHead>
							<TableHead className='text-center'>Môn học</TableHead>
							<TableHead className='text-center'>Sĩ số</TableHead>
							<TableHead className='text-center'>
								Tên bài, nội dung công việc
							</TableHead>
							<TableHead className='text-center'>Xếp loại</TableHead>
							<TableHead className='text-center'>Nhận xét</TableHead>
							<TableHead className='text-center'>Ký tên</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{daysOfWeek.length > 0 ? (
							daysOfWeek.map((day, dayIndex) => (
								<React.Fragment key={dayIndex}>
									<TableRow>
										<TableCell
											rowSpan={
												morningPeriods.length + afternoonPeriods.length + 1
											}
											className='text-center font-medium border-r'
										>
											<span>{day?.day ? day.day : 'Thứ'}</span>
											<br />
											<span>{day?.date ? day.date : 'Ngày'}</span>
										</TableCell>
									</TableRow>
									{/* Morning Periods */}
									{morningPeriods.map((period, periodIndex) => {
										const compareToRecord = chiTietSoDauBais.filter(
											(record) =>
												record?.biaSoDauBaiId === Number(id) &&
												normalizeString(record.daysOfTheWeek) ==
													normalizeString(day.day) &&
												record.thoiGian == day.date &&
												record.buoiHoc === 'Sáng' &&
												record.tietHoc === period
										);

										return compareToRecord.length > 0 ? (
											compareToRecord.map((key) => {
												const createdAtVN = addHours(key.createdAt, 7);
												const isDisabled =
													differenceInHours(new Date(), createdAtVN) > 2;

												return (
													<TableRow key={`morning-${dayIndex}-${period}`}>
														{periodIndex === 0 && (
															<TableCell
																rowSpan={morningPeriods.length}
																className='text-center font-medium border-r'
															>
																Sáng
															</TableCell>
														)}
														<TableCell className='text-center'>
															<div className='flex flex-col'>
																<Link
																	href={`/sodaubai/${id}/chitietsodaubai/${key.chiTietSoDauBaiId}`}
																>
																	<Button
																		title='Chỉnh sửa'
																		type='button'
																		variant={'outline'}
																		className='flex items-center justify-evenly bg-yellow-400 text-black mb-2 w-[80px]'
																		disabled={isDisabled}
																	>
																		<Edit />
																		Sửa
																	</Button>
																</Link>
																<DeleteChiTietSoDauBai
																	chitiet={key}
																	onDelete={(chiTietSoDauBaiId) => {
																		setChiTietSoDauBais((prev) =>
																			prev.filter(
																				(item) =>
																					item.chiTietSoDauBaiId !=
																					chiTietSoDauBaiId
																			)
																		);
																	}}
																	disabled={isDisabled}
																/>
															</div>
														</TableCell>
														<TableCell className='text-center'>
															{period}
														</TableCell>
														<TableCell>{key?.subjectName ?? '-'}</TableCell>
														<TableCell className='text-center'>
															{key?.attend ?? '-'}
														</TableCell>
														<TableCell>{key?.lessonContent ?? '-'}</TableCell>
														<TableCell className='text-center'>
															{key?.classifyName ?? '-'}
														</TableCell>
														<TableCell>{key?.noteComment ?? '-'}</TableCell>
														<TableCell>{key?.createdBy ?? '-'}</TableCell>
													</TableRow>
												);
											})
										) : (
											<TableRow key={`morning-${dayIndex}-${period}`}>
												{periodIndex === 0 && (
													<TableCell
														rowSpan={morningPeriods.length}
														className='text-center font-medium border-r'
													>
														Sáng
													</TableCell>
												)}
												<TableCell className='text-center'>
													<ChiTietSoDauBaiAddButton
														chiTietSoDauBai={{
															chiTietSoDauBaiId: 0,
															biaSoDauBaiId: Number(id),
															semesterId: selectedSemesterId || 0,
															weekId: selectedWeekId || 0,
															daysOfTheWeek: day?.day || '',
															thoiGian: parseDateFromDDMMYYYY(day?.date || ''),
															buoiHoc: 'Sáng',
															tietHoc: period,
															attend: 0,
															classificationId: 0,
															createdBy: teacherId ?? 0,
															lessonContent: '',
															subjectId: subjectId ?? 0,
															noteComment: '',
															createdAt: new Date(),
															updatedAt: new Date(),
														}}
														onSuccess={() => fetchChiTietSoDauBai()}
													/>
												</TableCell>
												<TableCell className='text-center'>{period}</TableCell>
												<TableCell>{'-'}</TableCell>
												<TableCell className='text-center'>{'-'}</TableCell>
												<TableCell>{'-'}</TableCell>
												<TableCell className='text-center'>{'-'}</TableCell>
												<TableCell>{'-'}</TableCell>
												<TableCell>{'-'}</TableCell>
											</TableRow>
										);
									})}
									{/* Afternoon Periods */}
									{afternoonPeriods.map((period, periodIndex) => {
										const compareToRecord = chiTietSoDauBais.filter(
											(record) =>
												record?.biaSoDauBaiId === Number(id) &&
												normalizeString(record.daysOfTheWeek) ==
													normalizeString(day.day) &&
												record.thoiGian == day.date &&
												record.buoiHoc === 'Chiều' &&
												record.tietHoc === period
										);

										return compareToRecord.length > 0 ? (
											compareToRecord.map((record, index) => {
												const createdAtVN = addHours(record.createdAt, 7);
												const isDisabled =
													differenceInHours(new Date(), createdAtVN) > 2;

												return (
													<TableRow
														key={`afternoon-${dayIndex}-${period}-${index}`}
													>
														{periodIndex === 0 && index === 0 && (
															<TableCell
																rowSpan={afternoonPeriods.length}
																className='text-center font-medium border-r'
															>
																Chiều
															</TableCell>
														)}
														<TableCell className='text-center'>
															<Link
																href={
																	isDisabled
																		? '#'
																		: `/sodaubai/${id}/chitietsodaubai/${record.chiTietSoDauBaiId}`
																}
															>
																<Button
																	title='Chỉnh sửa'
																	type='button'
																	variant={'outline'}
																	className='flex items-center justify-evenly bg-yellow-400 text-black mb-2 w-[80px]'
																	disabled={isDisabled}
																>
																	<Edit />
																	Sửa
																</Button>
															</Link>
															<DeleteChiTietSoDauBai
																chitiet={record}
																onDelete={(chiTietSoDauBaiId) => {
																	setChiTietSoDauBais((prev) =>
																		prev.filter(
																			(item) =>
																				item.chiTietSoDauBaiId !=
																				chiTietSoDauBaiId
																		)
																	);
																}}
																disabled={isDisabled}
															/>
														</TableCell>
														<TableCell className='text-center'>
															{period}
														</TableCell>
														<TableCell>{record?.subjectName ?? '-'}</TableCell>
														<TableCell className='text-center'>
															{record?.attend ?? '-'}
														</TableCell>
														<TableCell>
															{record?.lessonContent ?? '-'}
														</TableCell>
														<TableCell className='text-center'>
															{record?.classifyName ?? '-'}
														</TableCell>
														<TableCell>{record?.noteComment ?? '-'}</TableCell>
														<TableCell>{record?.createdBy ?? '-'}</TableCell>
													</TableRow>
												);
											})
										) : (
											<TableRow key={`afternoon-${dayIndex}-${period}`}>
												{periodIndex === 0 && (
													<TableCell
														rowSpan={afternoonPeriods.length}
														className='text-center font-medium border-r'
													>
														Chiều
													</TableCell>
												)}
												<TableCell className='text-center'>
													<ChiTietSoDauBaiAddButton
														chiTietSoDauBai={{
															chiTietSoDauBaiId: 0,
															biaSoDauBaiId: Number(id),
															semesterId: selectedSemesterId || 0,
															weekId: selectedWeekId || 0,
															daysOfTheWeek: day?.day || '',
															thoiGian: parseDateFromDDMMYYYY(day?.date || ''),
															buoiHoc: 'Chiều',
															tietHoc: period,
															attend: 0,
															classificationId: 0,
															createdBy: teacherId ?? 0,
															lessonContent: '',
															subjectId: subjectId ?? 0,
															noteComment: '',
															createdAt: new Date(),
															updatedAt: new Date(),
														}}
														onSuccess={() => fetchChiTietSoDauBai()}
													/>
												</TableCell>
												<TableCell className='text-center'>{period}</TableCell>
												<TableCell>{'-'}</TableCell>
												<TableCell className='text-center'>{'-'}</TableCell>
												<TableCell>{'-'}</TableCell>
												<TableCell className='text-center'>{'-'}</TableCell>
												<TableCell>{'-'}</TableCell>
												<TableCell>{'-'}</TableCell>
											</TableRow>
										);
									})}
								</React.Fragment>
							))
						) : (
							<TableRow>
								<TableCell colSpan={10} className='text-center'>
									Không có dữ liệu
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
