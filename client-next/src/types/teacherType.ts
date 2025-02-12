export interface TeacherType {
	teacherId: number;
	accountId: number;
	schoolId: number;
	fullname: string;
	dateOfBirth: Date | string | null;
	gender: boolean;
	address: string;
	status: boolean;
	dateCreate: Date | string | null;
	dateUpdate: Date | string | null;
	nameSchool: string;
	schoolType: boolean;
}
