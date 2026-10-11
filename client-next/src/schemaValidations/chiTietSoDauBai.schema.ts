import { z } from 'zod';
import {
	createApiResponseSchema,
	createPaginatedResponseSchema,
} from './common.schema';

export const ChiTietSoDauBaiSchema = z.object({
	id: z.number().optional(),
	chiTietSoDauBaiId: z.number().optional(), // alias
	biaSoDauBaiId: z.number(),
	semesterId: z.number(),
	weekId: z.number(),
	subjectId: z.number().optional(),
	classificationId: z.number().optional(),
	daysOfTheWeek: z.string(),
	time: z.union([z.string(), z.date()]).optional(),
	thoiGian: z.union([z.string(), z.date()]).optional(), // alias
	session: z.string().optional(),
	buoiHoc: z.string().optional(), // alias
	period: z.number().optional(),
	tietHoc: z.number().optional(), // alias
	lessonContent: z.string().optional().default(''),
	attend: z.number().optional().default(0),
	note: z.string().nullable().optional(),
	noteComment: z.string().nullable().optional(), // alias
	deleted: z.boolean().nullable().optional(),
	dateCreated: z.union([z.string(), z.date()]).nullable().optional(),
	dateUpdated: z.union([z.string(), z.date()]).nullable().optional(),
	createdAt: z.union([z.string(), z.date()]).nullable().optional(),
	updatedAt: z.union([z.string(), z.date()]).nullable().optional(),
	createdBy: z.union([z.number(), z.string()]).nullable().optional(),
	updatedBy: z.number().nullable().optional(),

	extendClassification: z
		.object({
			id: z.number().optional(),
			name: z.string().optional(),
			score: z.number().optional(),
		})
		.nullable()
		.optional(),
	extendBiaSoDauBai: z.any().nullable().optional(),
	extendUser: z.any().nullable().optional(),
	extendSemester: z.any().nullable().optional(),
	extendSubject: z
		.object({
			id: z.number().optional(),
			name: z.string().optional(),
		})
		.nullable()
		.optional(),
	extendWeek: z.any().nullable().optional(),

	// Flat display aliases
	subjectName: z.string().optional(),
	classifyName: z.string().optional(),
	className: z.string().optional(),
	semesterName: z.string().optional(),
	weekName: z.string().optional(),
});

export type ChiTietSoDauBaiDto = z.infer<typeof ChiTietSoDauBaiSchema>;
export type ChiTietSchemaType = ChiTietSoDauBaiDto;

export const ChiTietSchema = ChiTietSoDauBaiSchema;

export const ChiTietSoDauBaiRes = createApiResponseSchema(ChiTietSoDauBaiSchema);
export type ChiTietSoDauBaiResType = z.infer<typeof ChiTietSoDauBaiRes>;

export const chiTietSoDauBaiIdRes = ChiTietSoDauBaiRes;
export type chiTietSoDauBaiIdResType = ChiTietSoDauBaiResType;

export const ChiTietAddRes = ChiTietSoDauBaiRes;
export type ChiTietAddResType = ChiTietSoDauBaiResType;

export const ChiTietListRes = createApiResponseSchema(
	createPaginatedResponseSchema(ChiTietSoDauBaiSchema)
);
export type ChiTietListResType = z.infer<typeof ChiTietListRes>;

export const CreateChiTietBody = z.object({
	biaSoDauBaiId: z.number().optional(),
	BiaSoDauBaiId: z.number().optional(),
	semesterId: z.number().optional(),
	SemesterId: z.number().optional(),
	weekId: z.number().optional(),
	WeekId: z.number().optional(),
	subjectId: z.number().optional(),
	SubjectId: z.number().optional(),
	classificationId: z.number().optional(),
	ClassificationId: z.number().optional(),
	daysOfTheWeek: z.string().optional(),
	DaysOfTheWeek: z.string().optional(),
	time: z.union([z.string(), z.date()]).optional(),
	ThoiGian: z.union([z.string(), z.date()]).optional(),
	session: z.string().optional(),
	BuoiHoc: z.string().optional(),
	period: z.number().optional(),
	TietHoc: z.number().optional(),
	lessonContent: z.string().optional(),
	LessonContent: z.string().optional(),
	attend: z.number().optional(),
	Attend: z.number().optional(),
	note: z.string().nullable().optional(),
	NoteComment: z.string().nullable().optional(),
	createdBy: z.union([z.number(), z.string()]).nullable().optional(),
	CreatedBy: z.union([z.number(), z.string()]).nullable().optional(),
});
export type CreateChiTietBodyType = z.infer<typeof CreateChiTietBody>;

export const UpdateChiTietBody = z.object({
	id: z.number().optional(),
	biaSoDauBaiId: z.number(),
	semesterId: z.number(),
	weekId: z.number(),
	subjectId: z.number().optional().default(0),
	classificationId: z.number().optional().default(0),
	daysOfTheWeek: z.string(),
	time: z.union([z.string(), z.date()]).optional(),
	thoiGian: z.union([z.string(), z.date()]).optional(),
	session: z.string().optional(),
	buoiHoc: z.string().optional(),
	period: z.number().optional(),
	tietHoc: z.number().optional(),
	lessonContent: z.string(),
	attend: z.number(),
	note: z.string().nullable().optional(),
	noteComment: z.string().nullable().optional(),
	createdBy: z.union([z.number(), z.string()]).nullable().optional(),
});
export type UpdateChiTietBodyType = z.infer<typeof UpdateChiTietBody>;

export const ChiTietSoDauBaiParams = z.object({
	schoolId: z.number().optional(),
	academicYearId: z.number().optional(),
	semesterId: z.number().optional(),
	weekId: z.number().optional(),
	biaSoDauBaiId: z.number().optional(),
	subjectId: z.number().optional(),
	classificationId: z.number().optional(),
	keyword: z.string().optional(),
	sortBy: z.string().optional(),
	isDecsending: z.boolean().optional(),
	pageNumber: z.number().optional(),
	pageSize: z.number().optional(),
});
export type ChiTietSoDauBaiParamsType = z.infer<typeof ChiTietSoDauBaiParams>;

/**
 * Normalizes a ChiTietSoDauBai record so both backend camelCase and frontend legacy property names work seamlessly.
 */
export const normalizeChiTietSoDauBai = (item: any): ChiTietSoDauBaiDto => {
	if (!item) return item;

	let dateFormatted = '';
	if (item.time) {
		const d = new Date(item.time);
		if (!isNaN(d.getTime())) {
			const day = String(d.getDate()).padStart(2, '0');
			const month = String(d.getMonth() + 1).padStart(2, '0');
			const year = d.getFullYear();
			dateFormatted = `${day}/${month}/${year}`;
		}
	} else if (item.thoiGian) {
		if (typeof item.thoiGian === 'string') {
			dateFormatted = item.thoiGian;
		} else if (item.thoiGian instanceof Date) {
			const day = String(item.thoiGian.getDate()).padStart(2, '0');
			const month = String(item.thoiGian.getMonth() + 1).padStart(2, '0');
			const year = item.thoiGian.getFullYear();
			dateFormatted = `${day}/${month}/${year}`;
		}
	}

	const id = item.id ?? item.chiTietSoDauBaiId ?? 0;
	const session = item.session ?? item.buoiHoc ?? '';
	const period = item.period ?? item.tietHoc ?? 0;
	const note = item.note ?? item.noteComment ?? null;
	const subjectName = item.subjectName ?? item.extendSubject?.name ?? '';
	const classifyName = item.classifyName ?? item.extendClassification?.name ?? '';

	return {
		...item,
		id,
		chiTietSoDauBaiId: id,
		biaSoDauBaiId: item.biaSoDauBaiId,
		semesterId: item.semesterId,
		weekId: item.weekId,
		subjectId: item.subjectId,
		classificationId: item.classificationId,
		daysOfTheWeek: item.daysOfTheWeek,
		time: item.time ?? item.thoiGian,
		thoiGian: dateFormatted || item.thoiGian,
		session,
		buoiHoc: session,
		period,
		tietHoc: period,
		lessonContent: item.lessonContent ?? '',
		attend: item.attend ?? 0,
		note,
		noteComment: note,
		createdBy: item.createdBy,
		subjectName,
		classifyName,
	};
};
