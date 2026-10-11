import { z } from 'zod';
import {
	createApiResponseSchema,
	createPaginatedResponseSchema,
} from './common.schema';

export const StudentSchema = z.object({
	id: z.number().optional(),
	studentId: z.number().default(0), // alias
	classId: z.number().default(0),
	gradeId: z.number().default(0),
	userId: z.number().optional(),
	accountId: z.number().default(0), // alias
	schoolId: z.number().optional().default(0),
	roleId: z.number().optional().default(1),
	schoolName: z.string().optional().nullable(),
	className: z.string().optional().nullable(),
	email: z.string().optional().nullable(),
	fullname: z.string().default(''),
	address: z.string().optional().nullable(),
	dateOfBirth: z.union([z.string(), z.date()]).optional().nullable(),
	status: z.boolean().default(true),
	description: z.string().optional().nullable(),
	dateCreated: z.union([z.string(), z.date()]).optional().nullable(),
	dateUpdated: z.union([z.string(), z.date()]).optional().nullable(),
});

export type StudentDto = z.infer<typeof StudentSchema>;
export type StudentSchemaType = StudentDto;

export const StudentRes = createApiResponseSchema(StudentSchema);
export type StudentResType = z.infer<typeof StudentRes>;

export const StudentDetailRes = StudentRes;
export type StudentDetailResType = StudentResType;

export const StudentListRes = createApiResponseSchema(
	createPaginatedResponseSchema(StudentSchema)
);
export type StudentListResType = z.infer<typeof StudentListRes>;

export const StudentArrayRes = createApiResponseSchema(z.array(StudentSchema));
export type StudentArrayResType = z.infer<typeof StudentArrayRes>;

export const CreateStudentBody = z.object({
	id: z.number().optional(),
	studentId: z.number().optional(),
	classId: z.number({ required_error: 'Vui lòng chọn lớp học' }),
	gradeId: z.number().optional(),
	userId: z.number().optional(),
	accountId: z.number().optional(),
	fullname: z
		.string({ required_error: 'Vui lòng nhập họ và tên' })
		.min(1, 'Vui lòng nhập họ và tên'),
	address: z.string().optional().nullable(),
	dateOfBirth: z.union([z.string(), z.date()]).optional().nullable(),
	status: z.boolean().default(true),
	description: z.string().optional().nullable(),
	dateCreated: z.union([z.string(), z.date()]).optional().nullable(),
	dateUpdated: z.union([z.string(), z.date()]).optional().nullable(),
});
export type CreateStudentBodyType = z.infer<typeof CreateStudentBody>;

export const UpdateStudentBody = CreateStudentBody;
export type UpdateStudentBodyType = CreateStudentBodyType;
