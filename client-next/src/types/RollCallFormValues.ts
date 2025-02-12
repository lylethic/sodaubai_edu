interface RollCallFormValues {
	rollCall: {
		rollCallId: number;
		weekId: number;
		classId: number;
		dayOfTheWeek: string;
		dateAt: Date;
		numberOfAttendants: number;
	};
	absences: {
		rollCallDetailId: number;
		rollCallId: number;
		studentId: number;
		isExcused: boolean;
		description: string;
	}[];
}

export default RollCallFormValues;
