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
		className: z.string(),
		status: z.boolean(),
		dateCreated: z.date().nullable(),
		dateUpdated: z.date().nullable(),
	}),
});
export type PhanCongGiangDayResType = z.TypeOf<typeof PhanCongGiangDayRes>;

export const CreatePhanCongBody = z.object({
	TeacherId: z.number(),
	BiaSoDauBaiId: z.number(),
	Status: z.number(),
});
export type CreatePhanCongBodyType = z.TypeOf<typeof CreatePhanCongBody>;

export const UpdatePhanCongBody = z.object({
	phanCongGiangDayId: z.number(),
	biaSoDauBaiId: z.number(),
	teacherId: z.number(),
	status: z.number(),
});
export type UpdatePhanCongBodyType = z.TypeOf<typeof UpdatePhanCongBody>;
