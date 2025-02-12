import http from '@/lib/http';
import { QueryType } from '@/types/queryType';
import { MessageResType } from '@/schemaValidations/common.schema';
import {
	CreateTeacherBodyType,
	TeacherDetailResType,
	TeacherResType,
	UpdateTeacherBodyType,
} from '@/schemaValidations/teacher.schema';

const teacherApiRequest = {
	create: (body: CreateTeacherBodyType) => {
		const formData = new FormData();
		formData.append('AccountId', body.AccountId.toString());
		formData.append('SchoolId', body.SchoolId.toString());
		formData.append('Fullname', body.Fullname);
		formData.append(
			'DateOfBirth',
			body.DateOfBirth.toISOString().split('T')[0]
		);
		formData.append('Gender', body.Gender.toString());
		formData.append('Address', body.Address);
		formData.append('Status', body.Status.toString());

		if (body.PhotoPath instanceof File) {
			formData.append('PhotoPath', body.PhotoPath, body.PhotoPath.name);
		}
		return http.post<TeacherResType>('/Teachers', formData);
	},

	addPhoto: (body: FormData) =>
		http.post<{
			data: string;
		}>(`/Teachers/add-photo`, body),

	teacher: (id: number) => http.get<TeacherResType>(`/Teachers/${id}`),

	teachers: (query: QueryType) =>
		http.get<TeacherResType>(
			`/Teachers?pageNumber=${query.pageNumber}&pageSize=${query.pageSize}`,
			{
				cache: 'no-store',
			}
		),

	teacherByAccountId: (id: number | null) =>
		http.get<TeacherResType>(`/Teachers/teacher-by-account/${id}`, {
			cache: 'no-store',
		}),

	teacherDetail: (id: number, token: string) =>
		http.get<TeacherResType>(`/Teachers/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}),

	teacherDetailToUpdate: (id: number, token: string) =>
		http.get<TeacherDetailResType>(`/Teachers/teacher-to-update/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}),

	countTeachersBySchool: (id?: number) =>
		http.get<number | null>(`/Teachers/count-amount-of-teachers?id=${id}`),

	countAllTeachers: (signal?: AbortSignal | undefined) =>
		http.get<number | null>('/Teachers/count-amount-of-teachers', { signal }),

	teachersBySchool: (query: QueryType, id?: number) => {
		const queries = id
			? `schoolId=${id}&pageNumber=${query.pageNumber}&pageSize=${query.pageSize}`
			: `&pageNumber=${query.pageNumber}&pageSize=${query.pageSize}`;

		return http.get<TeacherResType>(`/Teachers/teachers-by-school?${queries}`, {
			cache: 'no-store',
		});
	},

	teachersBySchoolNoLimit: (id: number | null) =>
		http.get<TeacherResType>(`/Teachers/teachers-by-school?schoolId=${id}`, {
			cache: 'no-store',
		}),

	delete: (id: number) => http.delete<MessageResType>(`/Teachers/${id}`),

	bulkDelete: (ids: number[]) =>
		http.delete<MessageResType>(`/Teachers/bulk-delete`, ids),

	update: (id: number, body: UpdateTeacherBodyType) => {
		const formData = new FormData();
		formData.append('accountId', body.accountId.toString());
		formData.append('schoolId', body.schoolId.toString());
		formData.append('fullname', body.fullname);
		formData.append(
			'dateOfBirth',
			body.dateOfBirth.toISOString().split('T')[0]
		);
		formData.append('gender', body.gender.toString());
		formData.append('address', body.address);
		formData.append('status', body.status.toString());

		if (body.photoPath instanceof File) {
			formData.append('photoPath', body.photoPath, body.photoPath.name);
		}
		return http.put<TeacherResType>(`/Teachers/${id}`, formData);
	},

	importExcel: (body: FormData) => {
		return http.post<{
			message: string;
			data: string;
		}>(`/Teachers/upload`, body);
	},

	relativeSearchTeachers: (
		pageNumber: number,
		pageSize: number,
		schoolId?: number,
		name?: string
	) => {
		const params = new URLSearchParams({
			...(schoolId && { schoolId: schoolId.toString() }),
			...(name && { name: name }),
			pageNumber: pageNumber.toString(),
			pageSize: pageSize.toString(),
		}).toString();

		return http.get<TeacherResType>(`/Teachers/search?${params}`, {
			cache: 'no-store',
		});
	},
};

export default teacherApiRequest;
