import { z } from 'zod';

const SchoolRes = z
	.object({
		status: z.number(),
		message: z.string(),
		data: z.object({
			schoolId: z.number(),
			provinceId: z.number(),
			districtId: z.number(),
			nameSchool: z.string({ required_error: 'Vui lòng nhập tên trường học' }),
			address: z.string({ required_error: 'Vui lòng địa chỉ' }),
			phoneNumber: z.string({
				required_error: 'Vui lòng nhập tên số điện thoại trường học',
			}),
			schoolType: z.string(),
			description: z.string().optional(),
			dateCreated: z.date(),
			dateUpdated: z.date(),
		}),
		pagination: z.object({
			pageNumber: z.number(),
			pageSize: z.number(),
			totalResults: z.number(),
			totalPages: z.number(),
		}),
	})
	.strict();
export type SchoolResType = z.TypeOf<typeof SchoolRes>;

export const CreateSchoolBody = z.object({
	schoolId: z.number(),
	provinceId: z.number(),
	districtId: z.number(),
	nameSchool: z.string({ required_error: 'Vui lòng nhập tên trường học' }),
	address: z.string({ required_error: 'Vui lòng địa chỉ' }),
	phoneNumber: z.string({
		required_error: 'Vui lòng nhập tên số điện thoại trường học',
	}),
	schoolType: z.string(),
	description: z.string().optional(),
	dateCreated: z.date().nullable(),
	dateUpdated: z.date().nullable(),
});
export type CreateSchoolBodyType = z.TypeOf<typeof CreateSchoolBody>;

export const SchoolSchema = z.object({
	schoolId: z.number(),
	provinceId: z.number(),
	districtId: z.number(),
	nameSchool: z.string({ required_error: 'Vui lòng nhập tên trường học' }),
	address: z.string({ required_error: 'Vui lòng địa chỉ' }),
	phoneNumber: z.string({
		required_error: 'Vui lòng nhập tên số điện thoại trường học',
	}),
	schoolType: z.string(),
});

export const SchoolAddRes = z.object({
	message: z.string(),
	data: SchoolSchema,
});
export type SchoolAddResType = z.TypeOf<typeof SchoolAddRes>;

export const SchoolListRes = z.object({
	message: z.string(),
	data: z.array(SchoolSchema),
});

export type SchoolListResType = z.TypeOf<typeof SchoolListRes>;

export const UpdateSchoolBody = CreateSchoolBody;
export type UpdateSchoolBodyType = z.TypeOf<typeof UpdateSchoolBody>;

export const RoleParams = z.object({
	schoolId: z.coerce.number(),
});
