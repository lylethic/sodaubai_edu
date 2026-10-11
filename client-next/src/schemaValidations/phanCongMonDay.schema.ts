import { z } from 'zod';
import {
	createApiResponseSchema,
	createPaginatedResponseSchema,
} from './common.schema';

export const SubjectAssgmSchema = z.object({
	id: z.number().optional(),
	subjectAssignmentId: z.number().default(0), // alias
	teacherId: z.number().default(0),
	subjectId: z.number().default(0),
	subjectName: z.string().optional().nullable(),
	fullname: z.string().optional().nullable(),
	description: z.string().optional().nullable(),
	dateCreated: z.union([z.string(), z.date()]).optional().nullable(),
	dateUpdated: z.union([z.string(), z.date()]).optional().nullable(),
});

export type SubjectAssgmDto = z.infer<typeof SubjectAssgmSchema>;
export type SubjectAssgmSchemaType = SubjectAssgmDto;

export const SubjectAssgmRes = createApiResponseSchema(SubjectAssgmSchema);
export type SubjectAssgmResType = z.infer<typeof SubjectAssgmRes>;

export const SubjectAssgmListRes = createApiResponseSchema(
	createPaginatedResponseSchema(SubjectAssgmSchema)
);
export type SubjectAssgmListResType = z.infer<typeof SubjectAssgmListRes>;

// Legacy alias compatibility
export const PhanCongDayMonHocRes = SubjectAssgmRes;
export type PhanCongDayMonHocResType = SubjectAssgmResType;

export const CreateSubjectAssgmBody = z.object({
	id: z.number().optional(),
	subjectAssignmentId: z.number().optional(),
	teacherId: z
		.number({ required_error: 'Vui lòng chọn giáo viên' })
		.optional(),
	TeacherId: z.number().optional(),
	subjectId: z.number({ required_error: 'Vui lòng chọn môn học' }).optional(),
	SubjectId: z.number().optional(),
	description: z.string().optional().nullable(),
	Description: z.string().optional().nullable(),
});
export type CreateSubjectAssgmBodyType = z.infer<typeof CreateSubjectAssgmBody>;

export const CreatePhanCongDayMonHocBody = CreateSubjectAssgmBody;
export type CreatePhanCongDayMonHocBodyType = CreateSubjectAssgmBodyType;

export const UpdateSubjectAssgmBody = CreateSubjectAssgmBody;
export type UpdateSubjectAssgmBodyType = CreateSubjectAssgmBodyType;

export const UpdatePhanCongDayMonHocBody = UpdateSubjectAssgmBody;
export type UpdatePhanCongDayMonHocBodyType = UpdateSubjectAssgmBodyType;
