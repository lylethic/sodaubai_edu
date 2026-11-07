import { z } from 'zod';
import {
	createApiResponseSchema,
	createPaginatedResponseSchema,
} from './common.schema';

export const SchoolSchema = z.object({
	id: z.number(),
	schoolId: z.number().optional(), // backwards compatibility alias
	name: z.string({ required_error: 'Vui lòng nhập tên trường học' }),
	nameSchool: z.string().optional(), // backwards compatibility alias
	phoneNumber: z.string({
		required_error: 'Vui lòng nhập số điện thoại trường học',
	}),
	schoolType: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	level: z.number().nullable().optional(),
	provinceId: z.number().nullable().optional(),
	districtId: z.number().nullable().optional(),
	address: z.string().nullable().optional(),
	dateCreated: z.union([z.string(), z.date()]).nullable().optional(),
	dateUpdated: z.union([z.string(), z.date()]).nullable().optional(),
});

export type SchoolDto = z.infer<typeof SchoolSchema>;
export type SchoolType = SchoolDto;

export const SchoolRes = createApiResponseSchema(SchoolSchema);
export type SchoolResType = z.infer<typeof SchoolRes>;

export const SchoolListRes = createApiResponseSchema(
	createPaginatedResponseSchema(SchoolSchema)
);
export type SchoolListResType = z.infer<typeof SchoolListRes>;

export const CreateSchoolBody = z.object({
	name: z
		.string({ required_error: 'Vui lòng nhập tên trường học' })
		.min(1, 'Vui lòng nhập tên trường học')
		.optional(),
	nameSchool: z.string().optional(),
	phoneNumber: z
		.string({ required_error: 'Vui lòng nhập số điện thoại trường học' })
		.min(1, 'Vui lòng nhập số điện thoại trường học'),
	schoolType: z.string().optional().nullable(),
	description: z.string().optional().nullable(),
	level: z.number().optional().nullable(),
	schoolId: z.number().optional(),
	provinceId: z.number().optional().nullable(),
	districtId: z.number().optional().nullable(),
	address: z.string().optional().nullable(),
	dateCreated: z.union([z.string(), z.date()]).nullable().optional(),
	dateUpdated: z.union([z.string(), z.date()]).nullable().optional(),
});
export type CreateSchoolBodyType = z.infer<typeof CreateSchoolBody>;

export const UpdateSchoolBody = CreateSchoolBody.extend({
	id: z.number().optional(),
});
export type UpdateSchoolBodyType = z.infer<typeof UpdateSchoolBody>;

export const SchoolAddRes = SchoolRes;
export type SchoolAddResType = SchoolResType;

export const SchoolParams = z.object({
	id: z.coerce.number().optional(),
	schoolId: z.coerce.number().optional(),
});
