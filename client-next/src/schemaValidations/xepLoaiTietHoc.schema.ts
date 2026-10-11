import { z } from 'zod';
import {
	createApiResponseSchema,
	createPaginatedResponseSchema,
} from './common.schema';

export const ClassificationSchema = z.object({
	id: z.number().optional(),
	classificationId: z.number().default(0), // alias
	name: z.string().optional(),
	classifyName: z.string().default(''), // alias
	score: z.number().nullable().optional(),
	deleted: z.boolean().optional(),
});

export type ClassificationDto = z.infer<typeof ClassificationSchema>;
export type ClassificationSchemaType = ClassificationDto;
export type ClassifyType = ClassificationDto;

export const ClassificationRes = createApiResponseSchema(ClassificationSchema);
export type ClassificationResType = z.infer<typeof ClassificationRes>;

export const ClassificationListRes = createApiResponseSchema(
	createPaginatedResponseSchema(ClassificationSchema)
);
export type ClassificationListResType = z.infer<typeof ClassificationListRes>;

// Backwards compatibility aliases
export const ClassifyRes = ClassificationRes;
export type ClassifyResType = ClassificationResType;

export const ClassifyListRes = ClassificationListRes;
export type ClassifyListResType = ClassificationListResType;

export const CreateClassificationBody = z.object({
	id: z.number().optional(),
	classificationId: z.number().optional(),
	name: z.string().optional(),
	classifyName: z.string().optional(),
	score: z.number().optional(),
});
export type CreateClassificationBodyType = z.infer<
	typeof CreateClassificationBody
>;

export const CreateClassifyBody = CreateClassificationBody;
export type CreateClassifyBodyType = CreateClassificationBodyType;

export const UpdateClassificationBody = CreateClassificationBody;
export type UpdateClassificationBodyType = CreateClassificationBodyType;

export const UpdateClassifyBody = CreateClassificationBody;
export type UpdateClassifyBodyType = CreateClassificationBodyType;
