import http from '@/lib/http';
import {
	chiTietSoDauBaiIdResType,
	ChiTietSoDauBaiResType,
	CreateChiTietBodyType,
	UpdateChiTietBodyType,
} from '@/schemaValidations/chiTietSoDauBai.schema';
import { MessageResType } from '@/schemaValidations/common.schema';

const chiTietSoDauBaiApiRequest = {
	// api/ChiTietSoDauBais/get-chi-tiet-by-school?SchoolId=1&AcademicYearId=22&SemesterId=1&WeekId=1&BiaSoDauBaiId=1
	getBySchool: (
		schoolId: number,
		academicYearId: number,
		semesterId: number,
		weekId: number,
		biaSoDauBaiId: number
	) =>
		http.get<ChiTietSoDauBaiResType>(
			`/ChiTietSoDauBais/get-chi-tiet-by-school?schoolId=${schoolId}&academicYearId=${academicYearId}&semesterId=${semesterId}&weekId=${weekId}&biaSoDauBaiId=${biaSoDauBaiId}`
		),

	// Get theo bia, schoolId phai filter ben BiaSoDauBaiPage, bia di theo Chitiets
	getByAllChiTietsByBia: (
		academicYearId: number,
		semesterId: number,
		weekId: number,
		biaSoDauBaiId: number
	) =>
		http.get<ChiTietSoDauBaiResType>(
			`/ChiTietSoDauBais/get-chi-tiet-so-dau-bai-by-bia?academicYearId=${academicYearId}&semesterId=${semesterId}&weekId=${weekId}&biaSoDauBaiId=${biaSoDauBaiId}`
		),

	getById: (id: number) =>
		http.get<chiTietSoDauBaiIdResType>(`/ChiTietSoDauBais/${id}`),

	getDetail: (id: number, token: string) =>
		http.get<chiTietSoDauBaiIdResType>(`/ChiTietSoDauBais/${id}`, {
			headers: { Authorization: `Bearer ${token}` },
			cache: 'no-store',
		}),

	create: (body: CreateChiTietBodyType) =>
		http.post<ChiTietSoDauBaiResType>(`/ChiTietSoDauBais`, body),

	delete: (id: number) =>
		http.delete<MessageResType>(`/ChiTietSoDauBais/${id}`),

	update: (id: number, body: UpdateChiTietBodyType) =>
		http.put<MessageResType>(`/ChiTietSoDauBais/${id}`, body),

	bulkdelete: (ids: number[]) =>
		http.delete<MessageResType>('/ChiTietSoDauBais/bulkdelete', ids),

	importExcel: (body: FormData) => {
		return http.post<MessageResType>(`/ChiTietSoDauBais/upload`, body);
	},
};

export default chiTietSoDauBaiApiRequest;
