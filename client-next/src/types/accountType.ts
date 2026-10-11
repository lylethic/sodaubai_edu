export interface AccountType {
	id?: number;
	accountId: number;
	roleName?: string;
	schoolName?: string;
	schoolId?: number | null;
	email: string;
	username?: string | null;
	avatar?: string | null;
	dateCreated?: Date | string | null;
	dateUpdated?: Date | string | null;
}
