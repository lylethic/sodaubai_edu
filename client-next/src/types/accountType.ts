export interface AccountType {
  id: number;
  accountId: number;
  email: string | null;
  username: string | null;
  avatar: string | null;
  schoolId: number;
  schoolName: string | null;
  schoolType: number;
  schoolPhoneNumber: string | null;
  teacherId: number;
  fullname: string;
  roleId: number;
  nameRole: string | null;
  status?: boolean;
  gender: boolean;
  address: string | null;
  photoPath: string | null;
  dateCreated?: Date | string | null;
  dateUpdated?: Date | string | null;
}
