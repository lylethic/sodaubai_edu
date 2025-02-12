import { z } from 'zod';

export const WeekSchema = z.object({
	weekId: z.number(),
	weekName: z.string(),
	weekStart: z.string(),
	weekEnd: z.string(),
	status: z.boolean(),
	semesterId: z.number(),
	semesterName: z.string(),
	dateStart: z.string(),
	dateEnd: z.string(),
});

export const WeekRes = z
	.object({
		message: z.string(),
		data: z.object({
			weekId: z.number(),
			semesterId: z.number(),
			weekName: z.string(),
			weekStart: z.date(),
			weekEnd: z.date(),
			status: z.boolean(),
		}),
	})
	.strict();
export type WeekResType = z.TypeOf<typeof WeekRes>;

export const DaysOfWeekWeekRes = z
	.object({
		message: z.string(),
		data: z.object({
			day: z.string(),
			date: z.string(),
		}),
	})
	.strict();
export type DaysOfWeekResType = z.TypeOf<typeof DaysOfWeekWeekRes>;

export const CreateWeekBody = z.object({
	semesterId: z.number(),
	weekName: z.string(),
	weekStart: z.date(),
	weekEnd: z.date(),
	status: z.boolean(),
});
export type CreateWeekBodyType = z.TypeOf<typeof CreateWeekBody>;

export const UpdateWeekBody = z.object({
	semesterId: z.number(),
	weekName: z.string(),
	weekStart: z.date(),
	weekEnd: z.date(),
	status: z.boolean(),
});
export type UpdateWeekBodyType = z.TypeOf<typeof UpdateWeekBody>;

export const WeekListRes = z.object({
	status: z.number(),
	message: z.string(),
	data: WeekSchema,
	pagination: z.object({
		pageNumber: z.number(),
		pageSize: z.number(),
		totalResults: z.number(),
		totalPages: z.number(),
	}),
});
export type WeekListResType = z.TypeOf<typeof WeekListRes>;
