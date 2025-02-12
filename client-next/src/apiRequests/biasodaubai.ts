import {
	DetailToUpdateBiaSoDauBaiBody,
	DetailToUpdateBiaSoDauBaiBodyType,
} from './../schemaValidations/biaSoDauBai.schema';
import { QueryType } from './../types/queryType';
import http from '@/lib/http';
import {
	CreateBiaSoDauBaiBodyType,
	BiaSoDauBaiAddResType,
	BiaSoDauBaiResType,
	BiaSoDauBaiByIdResType,
	UpdateBiaSoDauBaiBodyType,
} from '@/schemaValidations/biaSoDauBai.schema';
import { MessageResType } from '@/schemaValidations/common.schema';

const biaSoDauBaiApiRequest = {
	countBiaSoDauBai: () =>
		http.get<number | null>('/BiaSoDauBais/count-bia-so-dau-bai'),

	countBiaSoDauBaiActive: () =>
		http.get<number | null>('/BiaSoDauBais/count-bia-so-dau-bai-active'),

	// Teacher
	// Status: true
	getAllBia: (pageNumber: number, pageSize: number) =>
		http.get<BiaSoDauBaiResType>(
			`/BiaSoDauBais?pageNumber=${pageNumber}&pageSize=${pageSize}`,
			{
				cache: 'no-store',
			}
		),

	getAllBiaBySchool: (pageNumber: number, pageSize: number, schoolId: number) =>
		http.get<BiaSoDauBaiResType>(
			`/BiaSoDauBais/get-by-school?pageNumber=${pageNumber}&pageSize=${pageSize}&schoolId=${schoolId}`,
			{
				cache: 'no-store',
			}
		),

	// api/BiaSoDauBais/get-bia-by-school-class?PageNumber=1&PageSize=20&schoolId=1
	// params: require: schoolId || optional: classId
	getAllBiaBySchoolClass: (
		pageNumber: number,
		pageSize: number,
		schoolId: number,
		classId?: number | null
	) => {
		const query = classId
			? `schoolId=${schoolId}&classId=${classId}`
			: `pageNumber=${pageNumber}&pageSize=${pageSize}&schoolId=${schoolId}`;

		return http.get<BiaSoDauBaiResType>(
			`/BiaSoDauBais/get-bia-by-school-class?${query}`,
			{
				cache: 'no-store',
			}
		);
	},

	getById: (id: number) =>
		http.get<BiaSoDauBaiByIdResType>(`/BiaSoDauBais/${id}`, {
			cache: 'no-store',
		}),

	getDetail: (id: number, token: string) =>
		http.get<BiaSoDauBaiResType>(`/BiaSoDauBais/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}),

	getDetailToUpdate: (id: number, token: string) =>
		http.get<DetailToUpdateBiaSoDauBaiBodyType>(
			`/BiaSoDauBais/get-to-update/${id}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		),

	create: (body: CreateBiaSoDauBaiBodyType) =>
		http.post<BiaSoDauBaiAddResType>(`/BiaSoDauBais`, body),

	delete: (id: number) => http.delete<MessageResType>(`/BiaSoDauBais/${id}`),

	update: (id: number, body: UpdateBiaSoDauBaiBodyType) =>
		http.put<MessageResType>(`/BiaSoDauBais/${id}`, body),

	bulkdelete: (ids: number[]) =>
		http.delete<MessageResType>('/BiaSoDauBais/bulkdelete', ids),

	importExcel: (body: FormData) => {
		return http.post<MessageResType>(`/BiaSoDauBais/upload`, body);
	},

	// res: message, array[{}...{}]
	// http://localhost:5204/api/BiaSoDauBais/search?SchoolId=1&PageNumber=1&PageSize=10
	search: (
		pageNumber: number,
		pageSize: number,
		schoolId?: number,
		classId?: number
	) => {
		const params = new URLSearchParams({
			...(schoolId && { schoolId: schoolId.toString() }),
			...(classId && { classId: classId.toString() }),
			pageNumber: pageNumber.toString(),
			pageSize: pageSize.toString(),
		});
		return http.get<BiaSoDauBaiResType>(
			`/BiaSoDauBais/search?${params.toString()}`
		);
	},

	// Admin
	// Status: true and false
	getAllBiaAdmin: (queryObject: QueryType) =>
		http.get<BiaSoDauBaiResType>(
			`/BiaSoDauBais/get-all-bia-so?pageNumber=${queryObject.pageNumber}&pageSize=${queryObject.pageSize}`
		),

	getAllBiaBySchoolAdmin: (
		pageNumber: number,
		pageSize: number,
		schoolId: number,
		token: string
	) =>
		http.get<BiaSoDauBaiResType>(
			`/BiaSoDauBais/get-all-bia-so-by-school?pageNumber=${pageNumber}&pageSize=${pageSize}&schoolId=${schoolId}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		),
};

export default biaSoDauBaiApiRequest;
