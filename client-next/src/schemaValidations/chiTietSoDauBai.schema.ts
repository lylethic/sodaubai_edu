import { z } from 'zod';

const ChiTietSoDauBaiRes = z
	.object({
		message: z.string(),
		data: z.object({
			chiTietSoDauBaiId: z.number(),
			biaSoDauBaiId: z.number(),
			className: z.string(),
			semesterId: z.number(),
			semesterName: z.string(),
			weekId: z.number(),
			weekName: z.string(),
			subjectId: z.number(),
			subjectName: z.string(),
			classificationId: z.number(),
			classifyName: z.string(),
			daysOfTheWeek: z.string(),
			thoiGian: z.string(),
			buoiHoc: z.string(),
			tietHoc: z.number(),
			lessonContent: z.string(),
			attend: z.number(),
			noteComment: z.string().nullable(),
			createdBy: z.string(),
			createdAt: z.date(),
			updatedAt: z.date().nullable(),
		}),
	})
	.strict();
export type ChiTietSoDauBaiResType = z.TypeOf<typeof ChiTietSoDauBaiRes>;

const chiTietSoDauBaiIdRes = z
	.object({
		message: z.string(),
		data: z.object({
			// chiTietSoDauBaiId: z.number().nullable(),
			biaSoDauBaiId: z.number(),
			semesterId: z.number(),
			weekId: z.number(),
			subjectId: z.number(),
			classificationId: z.number(),
			daysOfTheWeek: z.string(),
			thoiGian: z.date(),
			buoiHoc: z.string(),
			tietHoc: z.number(),
			lessonContent: z.string(),
			attend: z.number(),
			noteComment: z.string().nullable(),
			createdBy: z.number(),
			createdAt: z.date().nullable(),
			updatedAt: z.date().nullable(),
		}),
	})
	.strict();
export type chiTietSoDauBaiIdResType = z.TypeOf<typeof chiTietSoDauBaiIdRes>;

export const CreateChiTietBody = z.object({
	BiaSoDauBaiId: z.number(),
	SemesterId: z.number(),
	WeekId: z.number(),
	SubjectId: z.number(),
	ClassificationId: z.number(),
	DaysOfTheWeek: z.string(),
	ThoiGian: z.date(),
	BuoiHoc: z.string(),
	TietHoc: z.number(),
	LessonContent: z.string(),
	Attend: z.number(),
	NoteComment: z.string().nullable(),
	CreatedBy: z.number(),
});
export type CreateChiTietBodyType = z.TypeOf<typeof CreateChiTietBody>;

export const ChiTietSchema = z.object({
	chiTietSoDauBaiId: z.number(),
	biaSoDauBaiId: z.number(),
	semesterId: z.number(),
	weekId: z.number(),
	subjectId: z.number(),
	classificationId: z.number(),
	daysOfTheWeek: z.string(),
	thoiGian: z.date(),
	buoiHoc: z.string(),
	tietHoc: z.number(),
	lessonContent: z.string(),
	attend: z.number(),
	noteComment: z.string().nullable(),
	createdBy: z.number(),
	createdAt: z.date().nullable(),
	updatedAt: z.date().nullable(),
});

export const ChiTietAddRes = z.object({
	message: z.string(),
	data: ChiTietSchema,
});
export type ChiTietAddResType = z.TypeOf<typeof ChiTietAddRes>;

export const ChiTietListRes = z.object({
	message: z.string(),
	data: z.array(ChiTietSchema),
});
export type ChiTietListResType = z.TypeOf<typeof ChiTietListRes>;

export const ChiTietSoDauBaiParams = z.object({
	schoolId: z.number(),
	academicYearId: z.number(),
	semesterId: z.number(),
	weekId: z.number(),
});
export type ChiTietSoDauBaiParamsType = z.TypeOf<typeof ChiTietSoDauBaiParams>;

export const UpdateChiTietBody = z.object({
	biaSoDauBaiId: z.number(),
	semesterId: z.number(),
	weekId: z.number(),
	subjectId: z.number(),
	classificationId: z.number(),
	daysOfTheWeek: z.string(),
	thoiGian: z.date(),
	buoiHoc: z.string(),
	tietHoc: z.number(),
	lessonContent: z.string(),
	attend: z.number(),
	noteComment: z.string().nullable(),
	createdBy: z.number(),
});
export type UpdateChiTietBodyType = z.TypeOf<typeof UpdateChiTietBody>;
