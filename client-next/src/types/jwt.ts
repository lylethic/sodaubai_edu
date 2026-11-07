// src/types/jwt.ts
export interface JwtAccessTokenPayload {
	AccountId?: number;
	UserId?: number | string;
	id?: number;
	RoleId?: number | string;
	Role?: string;
	'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string;
	SchoolId?: number;
	Email?: string;
	email?: string;
	username?: string;
	name?: string;
	sub?: string;
	exp?: number;
}

