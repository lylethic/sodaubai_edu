import z from 'zod';

export const ClassifyRes = z.object({
	status: z.number(),
	message: z.string().nullable(),
	data: z.object({
		classificationId: z.number(),
		classifyName: z.string(),
		score: z.number(),
	}),
	pagination: z.object({
		pageNumber: z.number(),
		pageSize: z.number(),
		totalResults: z.number(),
		totalPages: z.number(),
	}),
});
export type ClassifyResType = z.TypeOf<typeof ClassifyRes>;

export const CreateClassifyBody = z.object({
	classificationId: z.number(),
	classifyName: z.string(),
	score: z.number(),
});
export type CreateClassifyBodyType = z.TypeOf<typeof CreateClassifyBody>;

const ClassifySchema = z.object({
	classificationId: z.number(),
	classifyName: z.string(),
	score: z.number(),
});

export const UpdateClassifyBody = ClassifySchema;
export type UpdateClassifyBodyType = z.TypeOf<typeof UpdateClassifyBody>;
