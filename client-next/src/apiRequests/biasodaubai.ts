import http from '@/lib/http';
import {
	BiaSoDauBaiAddResType,
	BiaSoDauBaiByIdResType,
	BiaSoDauBaiResType,
	BiaSoListResType,
	CreateBiaSoDauBaiBodyType,
	DetailToUpdateBiaSoDauBaiBodyType,
	UpdateBiaSoDauBaiBodyType,
} from '@/schemaValidations/biaSoDauBai.schema';
import { MessageResType } from '@/schemaValidations/common.schema';
import { ApiResponse, buildQueryString, QueryObject } from '@/types/api';
import { QueryType } from '@/types/queryType';

export interface BiaSoDauBaiQuery extends QueryObject {
	schoolId?: number | null;
	classId?: number | null;
	academicyearId?: number | null;
	academicYearId?: number | null;
	status?: boolean;
}

const normalizeBiaSoDauBai = (item: any) => {
	if (!item) return item;
	const id = item.id ?? item.biaSoDauBaiId ?? 0;
	const academicYearId =
		item.academicYearId ?? item.academicyearId ?? 0;
	return {
		...item,
		id,
		biaSoDauBaiId: item.biaSoDauBaiId ?? id,
		academicyearId: academicYearId,
		academicYearId: academicYearId,
		schoolName: item.schoolName ?? item.extendSchool?.name ?? '',
		nienKhoaName: item.nienKhoaName ?? item.extendAcademicYear?.name ?? '',
		className: item.className ?? item.extendClass?.name ?? '',
	};
};

const biaSoDauBaiApiRequest = {
	countBiaSoDauBai: async () => {
		try {
			const res = await http.get<BiaSoListResType>(
				'/v1/bia-so-dau-bais?pageNumber=1&pageSize=1',
				{ cache: 'no-store' }
			);
			return {
				...res,
				payload: res.payload?.data?.totalCount ?? 0,
			};
		} catch {
			return { payload: 0 };
		}
	},

	countBiaSoDauBaiActive: async () => {
		try {
			const res = await http.get<BiaSoListResType>(
				'/v1/bia-so-dau-bais?status=true&pageNumber=1&pageSize=1',
				{ cache: 'no-store' }
			);
			return {
				...res,
				payload: res.payload?.data?.totalCount ?? 0,
			};
		} catch {
			return { payload: 0 };
		}
	},

	getAllBia: async (pageNumber: number, pageSize: number) => {
		const res = await http.get<BiaSoListResType>(
			`/v1/bia-so-dau-bais?pageNumber=${pageNumber}&pageSize=${pageSize}&status=true`,
			{ cache: 'no-store' }
		);
		if (res.payload?.data?.items) {
			res.payload.data.items = res.payload.data.items.map(normalizeBiaSoDauBai);
		}
		return res;
	},

	getAllBiaBySchool: async (
		pageNumber: number,
		pageSize: number,
		schoolId: number
	) => {
		const res = await http.get<BiaSoListResType>(
			`/v1/bia-so-dau-bais?pageNumber=${pageNumber}&pageSize=${pageSize}&schoolId=${schoolId}&status=true`,
			{ cache: 'no-store' }
		);
		if (res.payload?.data?.items) {
			res.payload.data.items = res.payload.data.items.map(normalizeBiaSoDauBai);
		}
		return res;
	},

	getAllBiaBySchoolSelect: async (
		pageNumber: number,
		pageSize: number,
		schoolId: number
	) => {
		return biaSoDauBaiApiRequest.getAllBiaBySchool(pageNumber, pageSize, schoolId);
	},

	getAllBiaBySchoolClass: async (
		pageNumber: number,
		pageSize: number,
		schoolId: number,
		classId?: number | null
	) => {
		const query: BiaSoDauBaiQuery = {
			pageNumber,
			pageSize,
			schoolId,
			status: true,
		};
		if (classId) {
			query.classId = classId;
		}

		const res = await http.get<BiaSoListResType>(
			`/v1/bia-so-dau-bais${buildQueryString(query)}`,
			{ cache: 'no-store' }
		);
		if (res.payload?.data?.items) {
			res.payload.data.items = res.payload.data.items.map(normalizeBiaSoDauBai);
		}
		return res;
	},

	getById: async (id: number) => {
		const res = await http.get<BiaSoDauBaiByIdResType>(
			`/v1/bia-so-dau-bais/${id}`,
			{ cache: 'no-store' }
		);
		if (res.payload?.data) {
			res.payload.data = normalizeBiaSoDauBai(res.payload.data);
		}
		return res;
	},

	getDetail: async (id: number, token?: string) => {
		const res = await http.get<BiaSoDauBaiResType>(
			`/v1/bia-so-dau-bais/${id}`,
			{
				token,
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				cache: 'no-store',
			}
		);
		if (res.payload?.data) {
			res.payload.data = normalizeBiaSoDauBai(res.payload.data);
		}
		return res;
	},

	getDetailToUpdate: async (id: number, token?: string) => {
		const res = await http.get<DetailToUpdateBiaSoDauBaiBodyType>(
			`/v1/bia-so-dau-bais/${id}`,
			{
				token,
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				cache: 'no-store',
			}
		);
		if (res.payload?.data) {
			res.payload.data = normalizeBiaSoDauBai(res.payload.data);
		}
		return res;
	},

	create: (body: CreateBiaSoDauBaiBodyType) => {
		const payload = {
			schoolId: body.schoolId ?? body.SchoolId ?? 0,
			academicyearId:
				body.academicyearId ??
				body.academicYearId ??
				body.AcademicyearId ??
				0,
			classId: body.classId ?? body.ClassId ?? 0,
			status: body.status ?? body.Status ?? true,
		};
		return http.post<BiaSoDauBaiAddResType>('/v1/bia-so-dau-bais', payload);
	},

	delete: (id: number) =>
		http.delete<ApiResponse<boolean>>(`/v1/bia-so-dau-bais/${id}`),

	update: (id: number, body: UpdateBiaSoDauBaiBodyType) => {
		const payload = {
			id,
			schoolId: body.schoolId ?? body.SchoolId ?? 0,
			academicyearId:
				body.academicyearId ??
				body.academicYearId ??
				body.AcademicyearId ??
				0,
			classId: body.classId ?? body.ClassId ?? 0,
			status: body.status ?? body.Status ?? true,
		};
		return http.put<BiaSoDauBaiResType>(`/v1/bia-so-dau-bais/${id}`, payload);
	},

	bulkdelete: (ids: number[]) =>
		http.delete<ApiResponse<boolean>>('/v1/bia-so-dau-bais/bulkdelete', ids),

	bulkDelete: (ids: number[]) =>
		http.delete<ApiResponse<boolean>>('/v1/bia-so-dau-bais/bulkdelete', ids),

	importExcel: (body: FormData) =>
		http.post<MessageResType>('/v1/bia-so-dau-bais/upload', body),

	search: async (
		pageNumber: number,
		pageSize: number,
		schoolId?: number,
		classId?: number
	) => {
		const query: BiaSoDauBaiQuery = {
			pageNumber,
			pageSize,
			schoolId: schoolId || undefined,
			classId: classId || undefined,
		};
		const res = await http.get<BiaSoListResType>(
			`/v1/bia-so-dau-bais${buildQueryString(query)}`,
			{ cache: 'no-store' }
		);
		if (res.payload?.data?.items) {
			res.payload.data.items = res.payload.data.items.map(normalizeBiaSoDauBai);
		}
		return res;
	},

	getAllBiaAdmin: async (queryObject: QueryType) => {
		const res = await http.get<BiaSoListResType>(
			`/v1/bia-so-dau-bais${buildQueryString(queryObject as QueryObject)}`,
			{ cache: 'no-store' }
		);
		if (res.payload?.data?.items) {
			res.payload.data.items = res.payload.data.items.map(normalizeBiaSoDauBai);
		}
		return res;
	},

	getAllBiaBySchoolAdmin: async (
		pageNumber: number,
		pageSize: number,
		schoolId: number,
		token?: string
	) => {
		const res = await http.get<BiaSoListResType>(
			`/v1/bia-so-dau-bais?pageNumber=${pageNumber}&pageSize=${pageSize}&schoolId=${schoolId}`,
			{
				token,
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				cache: 'no-store',
			}
		);
		if (res.payload?.data?.items) {
			res.payload.data.items = res.payload.data.items.map(normalizeBiaSoDauBai);
		}
		return res;
	},
};

export default biaSoDauBaiApiRequest;
