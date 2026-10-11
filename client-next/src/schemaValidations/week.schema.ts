import { z } from 'zod';
import {
	createApiResponseSchema,
	createPaginatedResponseSchema,
} from './common.schema';

export const WeekSchema = z.object({
	id: z.number().optional(),
	weekId: z.number(),
	semesterId: z.number(),
	weekName: z.string({ required_error: 'Vui lòng nhập tên tuần học' }),
	weekStart: z.union([z.string(), z.date()]).nullable().optional(),
	weekEnd: z.union([z.string(), z.date()]).nullable().optional(),
	status: z.boolean(),
	semesterName: z.string().nullable().optional(),
	dateStart: z.union([z.string(), z.date()]).nullable().optional(),
	dateEnd: z.union([z.string(), z.date()]).nullable().optional(),
});

export type WeekDto = z.infer<typeof WeekSchema>;
export type WeekType = WeekDto;

export const WeekRes = createApiResponseSchema(WeekSchema);
export type WeekResType = z.infer<typeof WeekRes>;

export const WeekListRes = createApiResponseSchema(
	createPaginatedResponseSchema(WeekSchema)
);
export type WeekListResType = z.infer<typeof WeekListRes>;

export const DayItemSchema = z.object({
	dayOfWeek: z.string().optional(),
	day: z.string().optional(), // alias
	date: z.string(),
});
export type DayItemType = z.infer<typeof DayItemSchema>;

export const DaysOfWeekWeekRes = z.object({
	status: z.number().optional(),
	httpStatus: z.number().optional(),
	message: z.string().optional(),
	data: z.array(DayItemSchema),
});
export type DaysOfWeekResType = z.infer<typeof DaysOfWeekWeekRes>;

export const CreateWeekBody = z.object({
	weekId: z.number().optional(),
	semesterId: z.number({ required_error: 'Vui lòng chọn học kỳ' }),
	weekName: z.string({ required_error: 'Vui lòng nhập tên tuần học' }),
	weekStart: z.union([z.string(), z.date()]).nullable().optional(),
	weekEnd: z.union([z.string(), z.date()]).nullable().optional(),
	status: z.boolean(),
});
export type CreateWeekBodyType = z.infer<typeof CreateWeekBody>;

export const UpdateWeekBody = CreateWeekBody;
export type UpdateWeekBodyType = z.infer<typeof UpdateWeekBody>;
