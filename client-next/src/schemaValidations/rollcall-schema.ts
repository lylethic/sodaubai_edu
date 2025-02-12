import { z } from 'zod';

const StudentSchema = z.object({
	schoolId: z.number(),
	accountId: z.number(),
	studentId: z.number(),
	gradeId: z.number(),
	classId: z.number(),
	roleId: z.number(),
	schoolName: z.string(),
	className: z.string(),
	email: z.string(),
	fullname: z.string(),
	status: z.boolean(),
	description: z.string(),
	dateCreated: z.date(),
	dateUpdated: z.date(),
	address: z.string(),
	dateOfBirth: z.date(),
});

const RollCallDetailSchema = z.object({
	absenceId: z.number(),
	rollCallId: z.number(),
	studentId: z.number(),
	isExcused: z.boolean(),
	description: z.string(),
	student: StudentSchema,
});

const RollCallSchema = z
	.object({
		rollCallId: z.number(),
		weekId: z.number(),
		weekName: z.string(),
		classId: z.number(),
		className: z.string(),
		dayOfTheWeek: z.string(),
		dateAt: z.date(),
		dateCreated: z.date(),
		dateUpdated: z.date(),
		numberOfAttendants: z.number(),
		rollCallDetails: z.array(RollCallDetailSchema),
	})
	.strict();

export const RollCallRes = z.object({
	message: z.string(),
	data: RollCallSchema,
	pagination: z.object({
		pageNumber: z.number(),
		pageSize: z.number(),
		totalPages: z.number(),
		totalResults: z.number(),
	}),
});

export type RollCallResType = z.TypeOf<typeof RollCallRes>;
export type RollCallsResType = z.TypeOf<typeof RollCall>;

export const RollCall = z.object({
	rollCallId: z.number(),
	classId: z.number(),
	weekId: z.number(),
	dayOfTheWeek: z.string(),
	numberOfAttendants: z.number(),
	dateAt: z.date(),
});
export type CreateRollCallType = z.TypeOf<typeof RollCall>;

export const Absence = z.object({
	rollCallDetailId: z.number(),
	rollCallId: z.number(),
	studentId: z.number(),
	isExecute: z.boolean(),
	description: z.string(),
});
export type CreateAbsenceType = z.TypeOf<typeof Absence>;

export const CreateRollCallBody = z.object({
	rollCall: z.object({
		weekId: z.number(),
		classId: z.number(),
		dayOfTheWeek: z.string(),
		dateAt: z.date(),
		numberOfAttendants: z.number(),
	}),
	absences: z.array(
		z.object({
			rollCallDetailId: z.number().nullable(),
			rollCallId: z.number(),
			studentId: z.number(),
			isExcused: z.boolean(),
			description: z.string(),
		})
	),
});

export type CreateRollCallBodyType = z.TypeOf<typeof CreateRollCallBody>;

export const UpdateRollCallBody = CreateRollCallBody;
export type UpdateRollCallBodyType = z.TypeOf<typeof UpdateRollCallBody>;

export const RollCallById = z.object({
	message: z.string(),
	data: z.object({
		rollCallId: z.number(),
		classId: z.number(),
		weekId: z.number(),
		dayOfTheWeek: z.string(),
		dateAt: z.date(),
		dateCreated: z.date().nullable(),
		dateUpdated: z.date().nullable(),
		numberOfAttendants: z.number(),
	}),
});

export type RollCallByIdType = z.TypeOf<typeof RollCallById>;

// RollCallDetail => chi tiet cua diem danh
export const RollCallDetailRes = z.object({
	message: z.string(),
	data: z.object({
		absenceId: z.number(),
		rollCallId: z.number(),
		studentId: z.number(),
		isExcused: z.boolean(),
		description: z.string(),
		student: StudentSchema,
	}),
});

export type RollCallDetailResType = z.TypeOf<typeof RollCallDetailRes>;

export const CreateRollCallDetailBody = z.object({
	rollCallId: z.number(),
	studentId: z.number(),
	isExcused: z.boolean(),
	description: z.string(),
});

export type CreateRollCallDetailBodyType = z.TypeOf<
	typeof CreateRollCallDetailBody
>;

export const UpdateRollCallDetailBody = CreateRollCallDetailBody;
export type UpdateRollCallDetailBodyType = z.TypeOf<
	typeof UpdateRollCallDetailBody
>;
