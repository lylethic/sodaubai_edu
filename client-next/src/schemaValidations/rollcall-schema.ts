import { z } from 'zod';

export const StudentSchema = z.object({
	schoolId: z.number().optional(),
	accountId: z.number().optional(),
	studentId: z.number().optional(),
	gradeId: z.number().optional(),
	classId: z.number().optional(),
	roleId: z.number().optional(),
	schoolName: z.string().optional(),
	className: z.string().optional(),
	email: z.string().optional(),
	fullname: z.string().optional(),
	status: z.boolean().optional(),
	description: z.string().optional(),
	dateCreated: z.union([z.string(), z.date()]).optional(),
	dateUpdated: z.union([z.string(), z.date()]).optional(),
	address: z.string().optional(),
	dateOfBirth: z.union([z.string(), z.date()]).optional(),
});

export const RollCallDetailSchema = z.object({
	id: z.number().optional(),
	absenceId: z.number().optional(), // alias
	rollCallDetailId: z.number().optional(), // alias
	rollCallId: z.number().optional(),
	callRollId: z.number().optional(), // alias
	studentId: z.number(),
	isExecute: z.boolean().optional().default(false),
	isExcused: z.boolean().optional().default(false), // alias
	description: z.string().nullable().optional(),
	student: StudentSchema.optional(),
});
export type RollCallDetailDto = z.infer<typeof RollCallDetailSchema>;

export const RollCallSchema = z.object({
	id: z.number().optional(),
	callRollId: z.number().optional(),
	rollCallId: z.number().optional(), // alias
	classId: z.number(),
	weekId: z.number(),
	dayOfTheWeek: z.string().optional(),
	numberOfAttendants: z.number().optional().default(0),
	dateAt: z.union([z.string(), z.date()]).optional(),
	dateCreated: z.union([z.string(), z.date()]).nullable().optional(),
	dateUpdated: z.union([z.string(), z.date()]).nullable().optional(),
	rollCallDetails: z.array(RollCallDetailSchema).optional().default([]),
	weekName: z.string().optional(),
	className: z.string().optional(),
});
export type RollCallDto = z.infer<typeof RollCallSchema>;

export const RollCallRes = z.object({
	message: z.string().optional(),
	data: z.union([RollCallSchema, z.array(RollCallSchema)]),
	pagination: z
		.object({
			pageNumber: z.number().optional(),
			pageSize: z.number().optional(),
			totalPages: z.number().optional(),
			totalResults: z.number().optional(),
		})
		.optional(),
});
export type RollCallResType = z.infer<typeof RollCallRes>;
export type RollCallsResType = RollCallDto;

export const RollCall = z.object({
	id: z.number().optional(),
	rollCallId: z.number().optional(),
	callRollId: z.number().optional(),
	classId: z.number(),
	weekId: z.number(),
	dayOfTheWeek: z.string(),
	numberOfAttendants: z.number(),
	dateAt: z.union([z.string(), z.date()]).optional(),
});
export type CreateRollCallType = z.infer<typeof RollCall>;

export const Absence = z.object({
	id: z.number().optional(),
	rollCallDetailId: z.number().optional(),
	rollCallId: z.number().optional(),
	studentId: z.number(),
	isExecute: z.boolean().optional().default(false),
	isExcused: z.boolean().optional().default(false),
	description: z.string().optional(),
});
export type CreateAbsenceType = z.infer<typeof Absence>;

export const CreateRollCallBody = z.object({
	rollCall: z.object({
		callRollId: z.number().optional(),
		rollCallId: z.number().optional(),
		weekId: z.number(),
		classId: z.number(),
		dayOfTheWeek: z.string(),
		dateAt: z.union([z.string(), z.date()]).optional(),
		numberOfAttendants: z.number(),
	}),
	absences: z
		.array(
			z.object({
				id: z.number().optional(),
				rollCallDetailId: z.number().nullable().optional(),
				rollCallId: z.number().optional(),
				callRollId: z.number().optional(),
				studentId: z.number(),
				isExecute: z.boolean().optional(),
				isExcused: z.boolean().optional(),
				description: z.string().optional(),
			})
		)
		.optional()
		.default([]),
});
export type CreateRollCallBodyType = z.infer<typeof CreateRollCallBody>;

export const UpdateRollCallBody = CreateRollCallBody;
export type UpdateRollCallBodyType = z.infer<typeof UpdateRollCallBody>;

export const RollCallById = z.object({
	message: z.string().optional(),
	data: RollCallSchema,
});
export type RollCallByIdType = z.infer<typeof RollCallById>;

export const RollCallDetailRes = z.object({
	status: z.number().optional(),
	message: z.string().optional(),
	data: z.union([RollCallDetailSchema, z.array(RollCallDetailSchema)]),
});
export type RollCallDetailResType = z.infer<typeof RollCallDetailRes>;

export const CreateRollCallDetailBody = z.object({
	id: z.number().optional(),
	rollCallId: z.number().optional(),
	studentId: z.number(),
	isExecute: z.boolean().optional().default(false),
	isExcused: z.boolean().optional(),
	description: z.string().optional().nullable(),
});
export type CreateRollCallDetailBodyType = z.infer<
	typeof CreateRollCallDetailBody
>;

export const UpdateRollCallDetailBody = CreateRollCallDetailBody;
export type UpdateRollCallDetailBodyType = z.infer<
	typeof UpdateRollCallDetailBody
>;

export const normalizeRollCall = (item: any): RollCallDto => {
	if (!item) return item;
	const id = item.id ?? item.callRollId ?? item.rollCallId ?? 0;
	return {
		...item,
		id,
		callRollId: id,
		rollCallId: id,
		numberOfAttendants: item.numberOfAttendants ?? 0,
		rollCallDetails: Array.isArray(item.rollCallDetails) ? item.rollCallDetails : [],
	};
};
