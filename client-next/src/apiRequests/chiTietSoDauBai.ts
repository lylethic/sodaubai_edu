import http from '@/lib/http';
import {
	ChiTietListResType,
	ChiTietSoDauBaiParamsType,
	ChiTietSoDauBaiResType,
	CreateChiTietBodyType,
	UpdateChiTietBodyType,
} from '@/schemaValidations/chiTietSoDauBai.schema';
import { ApiResponseType } from '@/schemaValidations/common.schema';

const chiTietSoDauBaiApiRequest = {
	getAll: (params?: ChiTietSoDauBaiParamsType) => {
		const searchParams = new URLSearchParams();
		if (params?.biaSoDauBaiId) searchParams.set('biaSoDauBaiId', params.biaSoDauBaiId.toString());
		if (params?.semesterId) searchParams.set('semesterId', params.semesterId.toString());
		if (params?.weekId) searchParams.set('weekId', params.weekId.toString());
		if (params?.subjectId) searchParams.set('subjectId', params.subjectId.toString());
		if (params?.classificationId) searchParams.set('classificationId', params.classificationId.toString());
		if (params?.keyword) searchParams.set('keyword', params.keyword);
		if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
		if (params?.isDecsending !== undefined) searchParams.set('isDecsending', params.isDecsending.toString());
		if (params?.pageNumber) searchParams.set('pageNumber', params.pageNumber.toString());
		if (params?.pageSize) searchParams.set('pageSize', params.pageSize.toString());

		const query = searchParams.toString();
		return http.get<ChiTietListResType>(
			`/v1/chi-tiet-so-dau-bais${query ? `?${query}` : ''}`
		);
	},

	getBySchool: (
		schoolId: number,
		academicYearId: number,
		semesterId: number,
		weekId: number,
		biaSoDauBaiId: number
	) => {
		const params = new URLSearchParams();
		if (semesterId) params.set('semesterId', semesterId.toString());
		if (weekId) params.set('weekId', weekId.toString());
		if (biaSoDauBaiId) params.set('biaSoDauBaiId', biaSoDauBaiId.toString());
		params.set('pageSize', '100');

		return http.get<ChiTietListResType>(
			`/v1/chi-tiet-so-dau-bais?${params.toString()}`
		);
	},

	getByAllChiTietsByBia: (
		academicYearId: number,
		semesterId: number,
		weekId: number,
		biaSoDauBaiId: number
	) => {
		const params = new URLSearchParams();
		if (semesterId) params.set('semesterId', semesterId.toString());
		if (weekId) params.set('weekId', weekId.toString());
		if (biaSoDauBaiId) params.set('biaSoDauBaiId', biaSoDauBaiId.toString());
		params.set('pageSize', '100');

		return http.get<ChiTietListResType>(
			`/v1/chi-tiet-so-dau-bais?${params.toString()}`
		);
	},

	getById: (id: number) =>
		http.get<ChiTietSoDauBaiResType>(`/v1/chi-tiet-so-dau-bais/${id}`),

	getDetail: (id: number, token?: string) =>
		http.get<ChiTietSoDauBaiResType>(`/v1/chi-tiet-so-dau-bais/${id}`, {
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
			cache: 'no-store',
		}),

	create: (body: CreateChiTietBodyType) => {
		const payload = {
			biaSoDauBaiId: body.biaSoDauBaiId ?? body.BiaSoDauBaiId,
			semesterId: body.semesterId ?? body.SemesterId,
			weekId: body.weekId ?? body.WeekId,
			subjectId: body.subjectId ?? body.SubjectId,
			classificationId: body.classificationId ?? body.ClassificationId,
			daysOfTheWeek: body.daysOfTheWeek ?? body.DaysOfTheWeek,
			time: body.time ?? body.ThoiGian,
			session: body.session ?? body.BuoiHoc,
			period: body.period ?? body.TietHoc,
			lessonContent: body.lessonContent ?? body.LessonContent ?? '',
			attend: body.attend ?? body.Attend ?? 0,
			note: body.note ?? body.NoteComment ?? null,
			createdBy: body.createdBy ?? body.CreatedBy,
		};
		return http.post<ChiTietSoDauBaiResType>('/v1/chi-tiet-so-dau-bais', payload);
	},

	delete: (id: number) =>
		http.delete<ApiResponseType<boolean>>(`/v1/chi-tiet-so-dau-bais/${id}`),

	update: (id: number, body: UpdateChiTietBodyType | any) => {
		const payload = {
			id,
			biaSoDauBaiId: body.biaSoDauBaiId ?? body.BiaSoDauBaiId,
			semesterId: body.semesterId ?? body.SemesterId,
			weekId: body.weekId ?? body.WeekId,
			subjectId: body.subjectId ?? body.SubjectId,
			classificationId: body.classificationId ?? body.ClassificationId,
			daysOfTheWeek: body.daysOfTheWeek ?? body.DaysOfTheWeek,
			time: body.time ?? body.thoiGian ?? body.ThoiGian,
			session: body.session ?? body.buoiHoc ?? body.BuoiHoc,
			period: body.period ?? body.tietHoc ?? body.TietHoc,
			lessonContent: body.lessonContent ?? body.LessonContent ?? '',
			attend: body.attend ?? body.Attend ?? 0,
			note: body.note ?? body.noteComment ?? body.NoteComment ?? null,
			createdBy: body.createdBy ?? body.CreatedBy,
		};
		return http.put<ChiTietSoDauBaiResType>(
			`/v1/chi-tiet-so-dau-bais/${id}`,
			payload
		);
	},

	bulkdelete: (ids: number[]) =>
		http.delete<ApiResponseType<boolean>>(
			'/v1/chi-tiet-so-dau-bais/bulkdelete',
			ids
		),

	importExcel: (body: FormData) =>
		http.post<{ message: string }>('/v1/chi-tiet-so-dau-bais/upload', body),

	exportExcel: (weekId: number, classId: number) =>
		http.post<Blob>(
			`/v1/chi-tiet-so-dau-bais/export?weekId=${weekId}&classId=${classId}`,
			null
		),
};

export default chiTietSoDauBaiApiRequest;
