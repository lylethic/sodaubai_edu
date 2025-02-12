import { z } from 'zod';

export const SearchUserSchema = z.object({
	schoolId: z.number().optional(),
	roleId: z.number().optional(),
	name: z.string().optional(),
});

export const SearchBiaSoDauBaiSchema = z.object({
	schoolId: z.number().optional(),
	classId: z.number().optional(),
});
export type SearchBiaSoDauBaiSchemaType = z.TypeOf<
	typeof SearchBiaSoDauBaiSchema
>;
