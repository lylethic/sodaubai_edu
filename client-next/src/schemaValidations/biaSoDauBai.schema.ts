import { z } from 'zod';

/*
  "pagination": {
    "pageNumber": 1,
    "pageSize": 20,
    "totalResults": 2,
    "totalPages": 1
  }
*/
const BiaSoDauBaiRes = z
	.object({
		message: z.string(),
		pagination: z
			.object({
				pageNumber: z.number(),
				pageSize: z.number(),
				totalResults: z.number(),
				totalPages: z.number(),
			})
			.optional()
			.nullable(),
		totalResults: z.number().nullable(),
		data: z.object({
			biaSoDauBaiId: z.number(),
			schoolId: z.number(),
			academicyearId: z.number(),
			classId: z.number(),
			status: z.boolean(),
			schoolName: z.string(),
			className: z.string(),
			nienKhoaName: z.string(),
			tenGiaoVienChuNhiem: z.string(),
			dateCreated: z.string(),
			dateUpdated: z.string(),
		}),
	})
	.strict();

export type BiaSoDauBaiResType = z.TypeOf<typeof BiaSoDauBaiRes>;

// Dung de get cho edit
const BiaSoDauBaiByIdRes = z
	.object({
		message: z.string(),
		data: z.object({
			biaSoDauBaiId: z.number(),
			schoolId: z.number(),
			academicyearId: z.number(),
			classId: z.number(),
			status: z.boolean(),
			dateCreated: z.date(),
			dateUpdated: z.date(),
		}),
	})
	.strict();

export type BiaSoDauBaiByIdResType = z.TypeOf<typeof BiaSoDauBaiByIdRes>;

export const CreateBiaSoDauBaiBody = z.object({
	SchoolId: z.number(),
	AcademicyearId: z.number(),
	ClassId: z.number(),
	Status: z.boolean(),
	DateCreated: z.date().optional().nullable(),
	DateUpdated: z.date().optional().nullable(),
});

export type CreateBiaSoDauBaiBodyType = z.TypeOf<typeof CreateBiaSoDauBaiBody>;

export const BiaSoDauBaiSchema = z.object({
	biaSoDauBaiId: z.number(),
	schoolId: z.number(),
	academicyearId: z.number(),
	classId: z.number(),
	status: z.boolean(),
	dateCreated: z.date().nullable().optional(),
	dateUpdated: z.date().nullable().optional(),
});

export const BiaSoDauBaiAddRes = z.object({
	message: z.string(),
	data: BiaSoDauBaiSchema,
});
export type BiaSoDauBaiAddResType = z.TypeOf<typeof BiaSoDauBaiAddRes>;

export const BiaSoDauBaiListRes = z.object({
	message: z.string(),
	data: z.array(BiaSoDauBaiSchema),
});
export type BiaSoListResType = z.TypeOf<typeof BiaSoDauBaiListRes>;

export const DetailToUpdateBiaSoDauBaiBody = z.object({
	message: z.string(),
	data: z.object({
		biaSoDauBaiId: z.number(),
		schoolId: z.number(),
		academicyearId: z.number(),
		classId: z.number(),
		status: z.boolean(),
	}),
});

export type DetailToUpdateBiaSoDauBaiBodyType = z.TypeOf<
	typeof DetailToUpdateBiaSoDauBaiBody
>;

export const UpdateBiaSoDauBaiBody = BiaSoDauBaiSchema;
export type UpdateBiaSoDauBaiBodyType = z.TypeOf<typeof UpdateBiaSoDauBaiBody>;
