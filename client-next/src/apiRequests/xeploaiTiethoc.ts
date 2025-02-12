import http from '@/lib/http';
import { MessageResType } from '@/schemaValidations/common.schema';
import {
	CreateClassifyBodyType,
	ClassifyResType,
	UpdateClassifyBodyType,
} from '@/schemaValidations/xepLoaiTietHoc.schema';
import { QueryType } from '@/types/queryType';

export const xepLoaiApiRequest = {
	xeploais: (queryObject: QueryType) =>
		http.get<ClassifyResType>(
			`/Classifications?pageNumber=${queryObject.pageNumber}&pageSize=${queryObject.pageSize}`
		),

	xeploaisNoPagination: () => http.get<ClassifyResType>('/Classifications'),

	xeploai: (id: number, token?: string) =>
		http.get<ClassifyResType>(`/Classifications/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}),

	create: (body: CreateClassifyBodyType) =>
		http.post<MessageResType>('/Classifications', body),

	update: (id: number, body: UpdateClassifyBodyType) =>
		http.put<MessageResType>(`/Classifications/${id}`, body),

	delete: (id: number) => http.delete<MessageResType>(`/Classifications/${id}`),

	bulkdelete: (ids: number[]) =>
		http.delete<MessageResType>('/Classifications/bulkdelete', ids),

	upload: (file: FormData) =>
		http.post<MessageResType>('/Classifications/upload', file),
};
