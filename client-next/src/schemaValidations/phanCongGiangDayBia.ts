import z from 'zod';

const PhanCongGiangDaySchema = z.object({
	phanCongGiangDayId: z.number(),
	biaSoDauBaiId: z.number(),
	teacherId: z.number(),
	status: z.number(),
	dateCreated: z.date().nullable(),
	dateUpdated: z.date().nullable(),
});

export type PhanCongGiangDaySchemaResType = z.TypeOf<
	typeof PhanCongGiangDaySchema
>;

export const PhanCongGiangDayRes = z.object({
	status: z.number(),
	message: z.string(),
	data: z.object({
		phanCongGiangDayId: z.number(),
		biaSoDauBaiId: z.number(),
		teacherId: z.number(),
		fullname: z.string(),
		classId: z.number(),
		className: z.string(),
		status: z.boolean(),
		dateCreated: z.date().nullable(),
		dateUpdated: z.date().nullable(),
	}),
	pagination: z.object({
		pageNumber: z.number(),
		pageSize: z.number(),
		totalPages: z.number(),
		totalResults: z.number(),
	}),
});
export type PhanCongGiangDayResType = z.TypeOf<typeof PhanCongGiangDayRes>;

export const CreatePhanCongBody = z.object({
	phanCongGiangDayId: z.number(),
	biaSoDauBaiId: z.number(),
	teacherId: z.number(),
	status: z.boolean(),
});
export type CreatePhanCongBodyType = z.TypeOf<typeof CreatePhanCongBody>;

export const UpdatePhanCongBody = CreatePhanCongBody;
export type UpdatePhanCongBodyType = z.TypeOf<typeof UpdatePhanCongBody>;
