import { z } from "zod";
import {
  createApiResponseSchema,
  createPaginatedResponseSchema,
} from "./common.schema";

export const TeacherSchema = z.object({
  id: z.number().optional(),
  teacherId: z.number().default(0),
  userId: z.number().optional(),
  schoolId: z.number().default(0),
  fullname: z.string().default(""),
  dateOfBirth: z.union([z.string(), z.date()]).optional().nullable(),
  gender: z.boolean().default(true),
  address: z.string().optional().nullable(),
  status: z.boolean().default(true),
  photoPath: z.string().optional().nullable(),
  dateCreated: z.union([z.string(), z.date()]).optional().nullable(),
  dateUpdated: z.union([z.string(), z.date()]).optional().nullable(),
});

export type TeacherDto = z.infer<typeof TeacherSchema>;
export type TeacherSchemaType = TeacherDto;

export const TeacherRes = createApiResponseSchema(TeacherSchema);
export type TeacherResType = z.infer<typeof TeacherRes>;

export const TeacherDetailRes = TeacherRes;
export type TeacherDetailResType = TeacherResType;

export const TeacherListRes = createApiResponseSchema(
  createPaginatedResponseSchema(TeacherSchema),
);
export type TeacherListResType = z.infer<typeof TeacherListRes>;

export const CreateTeacherBody = z.object({
  id: z.number().optional(),
  teacherId: z.number().optional(),
  userId: z.number().optional(),
  schoolId: z.number({ required_error: "Vui lòng chọn trường học" }).optional(),
  fullname: z.string().optional(),
  dateOfBirth: z.union([z.string(), z.date()]).nullable().optional(),
  gender: z.boolean().optional(),
  address: z.string().nullable().optional(),
  status: z.boolean().optional(),
  photoPath: z.any().nullable().optional(),
});
export type CreateTeacherBodyType = z.infer<typeof CreateTeacherBody>;

export const UpdateTeacherBody = CreateTeacherBody;
export type UpdateTeacherBodyType = CreateTeacherBodyType;

export const TeacherParams = z.object({
  accountId: z.coerce.number().optional(),
  userId: z.coerce.number().optional(),
});
export type TeacherParamsType = z.infer<typeof TeacherParams>;
