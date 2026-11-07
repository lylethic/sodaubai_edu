import { z } from 'zod';
import {
	createApiResponseSchema,
	createPaginatedResponseSchema,
} from './common.schema';

export const BiaSoDauBaiSchema = z.object({
	id: z.number().optional(),
	biaSoDauBaiId: z.number().default(0), // alias
	schoolId: z.number().default(0),
	academicyearId: z.number().default(0),
	academicYearId: z.number().default(0), // alias
	classId: z.number().default(0),
	status: z.boolean().default(true),
	schoolName: z.string().optional().nullable(),
	className: z.string().optional().nullable(),
	nienKhoaName: z.string().optional().nullable(),
	tenGiaoVienChuNhiem: z.string().optional().nullable(),
	dateCreated: z.union([z.string(), z.date()]).optional().nullable(),
	dateUpdated: z.union([z.string(), z.date()]).optional().nullable(),
	extendSchool: z
		.object({
			name: z.string().optional().nullable(),
		})
		.optional()
		.nullable(),
	extendAcademicYear: z
		.object({
			name: z.string().optional().nullable(),
		})
		.optional()
		.nullable(),
	extendClass: z
		.object({
			name: z.string().optional().nullable(),
		})
		.optional()
		.nullable(),
});

export type BiaSoDauBaiDto = z.infer<typeof BiaSoDauBaiSchema>;
export type BiaSoDauBaiSchemaType = BiaSoDauBaiDto;

export const BiaSoDauBaiRes = createApiResponseSchema(BiaSoDauBaiSchema);
export type BiaSoDauBaiResType = z.infer<typeof BiaSoDauBaiRes>;

export const BiaSoDauBaiByIdRes = BiaSoDauBaiRes;
export type BiaSoDauBaiByIdResType = BiaSoDauBaiResType;

export const BiaSoDauBaiListRes = createApiResponseSchema(
	createPaginatedResponseSchema(BiaSoDauBaiSchema)
);
export type BiaSoListResType = z.infer<typeof BiaSoDauBaiListRes>;

export const BiaSoDauBaiAddRes = BiaSoDauBaiRes;
export type BiaSoDauBaiAddResType = BiaSoDauBaiResType;

export const CreateBiaSoDauBaiBody = z.object({
	id: z.number().optional(),
	biaSoDauBaiId: z.number().optional(),
	SchoolId: z.number().optional(),
	schoolId: z.number().optional(),
	AcademicyearId: z.number().optional(),
	academicyearId: z.number().optional(),
	academicYearId: z.number().optional(),
	ClassId: z.number().optional(),
	classId: z.number().optional(),
	Status: z.boolean().optional(),
	status: z.boolean().default(true),
	DateCreated: z.union([z.string(), z.date()]).optional().nullable(),
	dateCreated: z.union([z.string(), z.date()]).optional().nullable(),
	DateUpdated: z.union([z.string(), z.date()]).optional().nullable(),
	dateUpdated: z.union([z.string(), z.date()]).optional().nullable(),
});
export type CreateBiaSoDauBaiBodyType = z.infer<typeof CreateBiaSoDauBaiBody>;

export const DetailToUpdateBiaSoDauBaiBody = BiaSoDauBaiRes;
export type DetailToUpdateBiaSoDauBaiBodyType = BiaSoDauBaiResType;

export const UpdateBiaSoDauBaiBody = CreateBiaSoDauBaiBody;
export type UpdateBiaSoDauBaiBodyType = CreateBiaSoDauBaiBodyType;

export const normalizeBiaSoDauBai = (item: any): BiaSoDauBaiDto => {
	if (!item) return item;
	const id = item.id ?? item.biaSoDauBaiId ?? 0;
	return {
		...item,
		id,
		biaSoDauBaiId: id,
		schoolId: item.schoolId,
		academicyearId: item.academicyearId ?? item.academicYearId,
		academicYearId: item.academicYearId ?? item.academicyearId,
		classId: item.classId,
		status: item.status ?? true,
		schoolName: item.schoolName ?? item.extendSchool?.name,
		nienKhoaName: item.nienKhoaName ?? item.extendAcademicYear?.name,
		className: item.className ?? item.extendClass?.name,
		extendSchool: item.extendSchool,
		extendAcademicYear: item.extendAcademicYear,
		extendClass: item.extendClass,
	};
};

