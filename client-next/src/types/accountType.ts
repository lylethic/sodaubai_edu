export interface AccountType {
	accountId: number;
	roleName: string;
	schoolName?: string;
	email: string;
	dateCreated: Date | null;
	dateUpdated: Date | null;
}
