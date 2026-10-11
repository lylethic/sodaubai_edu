import { z } from 'zod';

export const MessageRes = z
	.object({
		message: z.string().optional(),
		status: z.number().optional(),
		statusCode: z.number().optional(),
		success: z.boolean().optional(),
	})
	.passthrough();

export type MessageResType = z.TypeOf<typeof MessageRes>;

/**
 * Zod schema generator for standard backend ApiResponseModel<T>
 */
export const createApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
	z.object({
		httpStatus: z.number(),
		success: z.boolean(),
		data: dataSchema,
		errorCode: z.string().nullable().optional(),
		message: z.string(),
	});

export type ApiResponseType<T = any> = {
	httpStatus: number;
	success: boolean;
	data: T;
	errorCode?: string | null;
	message: string;
};

/**
 * Zod schema generator for standard backend PaginatedResponse<T>
 */
export const createPaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
	z.object({
		items: z.array(itemSchema),
		pageNumber: z.number(),
		pageSize: z.number(),
		totalCount: z.number(),
	});

/**
 * QueryObject search parameters schema
 */
export const QueryObjectSchema = z.object({
	pageNumber: z.coerce.number().optional().default(1),
	pageSize: z.coerce.number().optional().default(20),
	keyword: z.string().optional().nullable(),
	sortBy: z.string().optional().nullable(),
	isDecsending: z.coerce.boolean().optional().default(false),
});

export type QueryObjectType = z.infer<typeof QueryObjectSchema>;
