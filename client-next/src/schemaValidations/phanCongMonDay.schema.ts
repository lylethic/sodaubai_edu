import z from 'zod';

export const SubjectAssgmSchema = z.object({
	subjectAssignmentId: z.number(),
	teacherId: z.number(),
	subjectId: z.number(),
	description: z.string().nullable(),
	dateCreated: z.date().nullable(),
	dateUpdated: z.date().nullable(),
});
export type SubjectAssgmSchemaType = z.TypeOf<typeof SubjectAssgmSchema>;

export const PhanCongDayMonHocRes = z
	.object({
		status: z.number(),
		message: z.string(),
		data: z.object({
			subjectAssignmentId: z.number(),
			teacherId: z.number(),
			fullname: z.string(),
			subjectId: z.number(),
			subjectName: z.string().nullable(),
			description: z.string().nullable(),
			dateCreated: z.date().nullable(),
			dateUpdated: z.date().nullable(),
		}),
	})
	.strict();

export type PhanCongDayMonHocResType = z.TypeOf<typeof PhanCongDayMonHocRes>;

export const CreatePhanCongDayMonHocBody = z.object({
	SubjectId: z.number(),
	TeacherId: z.number(),
	Description: z.string().nullable(),
});
export type CreatePhanCongDayMonHocBodyType = z.TypeOf<
	typeof CreatePhanCongDayMonHocBody
>;

export const UpdatePhanCongDayMonHocBody = z.object({
	subjectId: z.number(),
	teacherId: z.number(),
	description: z.string().nullable(),
});
export type UpdatePhanCongDayMonHocBodyType = z.TypeOf<
	typeof UpdatePhanCongDayMonHocBody
>;
