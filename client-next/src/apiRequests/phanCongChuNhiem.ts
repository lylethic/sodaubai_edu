import http from '@/lib/http';
import { MessageResType } from '@/schemaValidations/common.schema';
import {
	CreatePhanCongChuNhiemBodyType,
	PhanCongChuNhiemResType,
	UpdatePhanCongChuNhiemBodyType,
} from '@/schemaValidations/phanCongChuNhiemLop.schema';
import { QueryType } from '@/types/queryType';

export const PhanCongChuNhiemApiRequest = {
	phanCongs: (
		pageNumber: number,
		pageSize: number,
		schoolId: number | null,
		gradeId?: number | null,
		classId?: number | null
	) => {
		const queryParams = new URLSearchParams({
			pageNumber: pageNumber.toString(),
			pageSize: pageSize.toString(),
		});
		if (schoolId !== null && schoolId !== undefined) {
			queryParams.append('schoolId', schoolId.toString());
		}
		if (gradeId !== null && gradeId !== undefined) {
			queryParams.append('gradeId', gradeId.toString());
		}

		if (classId !== null && classId !== undefined) {
			queryParams.append('classId', classId.toString());
		}

		return http.get<PhanCongChuNhiemResType>(
			`/PhanCongGiaoVienChuNhiems/phan-cong-detail?${queryParams.toString()}`,
			{
				cache: 'no-cache',
			}
		);
	},

	phanCong: (id: number, token: string) =>
		http.get<PhanCongChuNhiemResType>(`/PhanCongGiaoVienChuNhiems/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}),

	create: (body: CreatePhanCongChuNhiemBodyType) =>
		http.post<MessageResType>('/PhanCongGiaoVienChuNhiems', body),

	update: (id: number, body: UpdatePhanCongChuNhiemBodyType) =>
		http.put<MessageResType>(`/PhanCongGiaoVienChuNhiems/${id}`, body),

	delete: (id: number) =>
		http.delete<MessageResType>(`/PhanCongGiaoVienChuNhiems/${id}`),

	bulkdelete: (ids: number[]) =>
		http.delete<MessageResType>(`/PhanCongGiaoVienChuNhiems/bulk-delete`, ids),

	upload: (formData: FormData) =>
		http.post<MessageResType>('/PhanCongGiaoVienChuNhiems/upload', formData),
};
