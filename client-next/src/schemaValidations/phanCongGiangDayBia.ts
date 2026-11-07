import { z } from 'zod';
import {
	createApiResponseSchema,
	createPaginatedResponseSchema,
} from './common.schema';

export const PhanCongGiangDaySchema = z.object({
	id: z.number().optional(),
	phanCongGiangDayId: z.number().default(0), // alias
	biaSoDauBaiId: z.number().default(0),
	teacherId: z.number().default(0),
	fullname: z.string().optional().nullable(),
	classId: z.number().optional().default(0),
	className: z.string().optional().nullable(),
	status: z.boolean().default(true),
	dateCreated: z.union([z.string(), z.date()]).optional().nullable(),
	dateUpdated: z.union([z.string(), z.date()]).optional().nullable(),
});

export type PC_GiangDay_BiaSDBDto = z.infer<typeof PhanCongGiangDaySchema>;
export type PhanCongGiangDaySchemaResType = PC_GiangDay_BiaSDBDto;

export const PhanCongGiangDayRes = createApiResponseSchema(
	PhanCongGiangDaySchema
);
export type PhanCongGiangDayResType = z.infer<typeof PhanCongGiangDayRes>;

export const PhanCongGiangDayListRes = createApiResponseSchema(
	createPaginatedResponseSchema(PhanCongGiangDaySchema)
);
export type PhanCongGiangDayListResType = z.infer<
	typeof PhanCongGiangDayListRes
>;

export const PhanCongGiangDayArrayRes = createApiResponseSchema(
	z.array(PhanCongGiangDaySchema)
);
export type PhanCongGiangDayArrayResType = z.infer<
	typeof PhanCongGiangDayArrayRes
>;

export const CreatePhanCongBody = z.object({
	id: z.number().optional(),
	phanCongGiangDayId: z.number().optional(),
	biaSoDauBaiId: z.number({ required_error: 'Vui lòng chọn sổ đầu bài' }),
	teacherId: z.number({ required_error: 'Vui lòng chọn giáo viên' }),
	status: z.boolean().default(true),
});
export type CreatePhanCongBodyType = z.infer<typeof CreatePhanCongBody>;

export const UpdatePhanCongBody = CreatePhanCongBody;
export type UpdatePhanCongBodyType = CreatePhanCongBodyType;
