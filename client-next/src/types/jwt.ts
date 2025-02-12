// src/types/jwt.ts
export interface JwtAccessTokenPayload {
	AccountId: number;
	RoleId: number;
	SchoolId: number;
	Email: string;
	exp: number;
}
