import { z } from "zod";
import {
  createApiResponseSchema,
  createPaginatedResponseSchema,
} from "./common.schema";

export const UserSchema = z.object({
  id: z.number(),
  accountId: z.number().optional(), // alias of id, added when normalizing
  email: z.string().email(),
  username: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
  schoolId: z.number().nullable().optional(),
  schoolName: z.string().nullable().optional(),
  schoolType: z.string().nullable().optional(),
  schoolPhoneNumber: z.string().nullable().optional(),
  teacherId: z.number().nullable().optional(),
  fullname: z.string().nullable().optional(),
  roleId: z.number().nullable().optional(),
  nameRole: z.string().optional(),
  status: z.boolean().nullable().optional(),
  gender: z.boolean(),
  address: z.string(),
  photoPath: z.string(),
  dateCreated: z.union([z.string(), z.date()]).nullable().optional(),
  dateUpdated: z.union([z.string(), z.date()]).nullable().optional(),
});

export const UserInfoSchema = z.object({});

export type UserDto = z.infer<typeof UserSchema>;
export type UserSchemaType = z.infer<typeof UserSchema>;

export const UserRes = createApiResponseSchema(UserSchema);
export type UserResType = z.infer<typeof UserRes>;

export const UserDetailRes = UserRes;
export type UserDetailResType = UserResType;

export const UserListRes = createApiResponseSchema(
  createPaginatedResponseSchema(UserSchema),
);
export type UserListResType = z.infer<typeof UserListRes>;

export const CreateUserBody = z.object({
  schoolId: z.number({ required_error: "Vui lòng chọn trường" }),
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format"),
  username: z.string().optional(),
  avatar: z.string().optional(),
  password: z.string().min(6).max(100).optional(),
  passwordHash: z.string().min(6).max(100).optional(),
  roleId: z.number().optional(),
  RoleId: z.number().optional(),
  SchoolId: z.number().optional(),
  Email: z.string().email().optional(),
  Password: z.string().optional(),
});

export type CreateUserBodyType = z.infer<typeof CreateUserBody>;

export const UpdateUserBody = z.object({
  id: z.number().optional(),
  schoolId: z.number().nullable().optional(),
  email: z.string().email().optional(),
  username: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
  roleId: z.number().nullable().optional(),
  dateCreated: z.union([z.string(), z.date()]).nullable().optional(),
  dateUpdated: z.union([z.string(), z.date()]).nullable().optional(),
});

export type UpdateUserBodyType = z.infer<typeof UpdateUserBody>;

export const UserAddRes = UserRes;
export type UserAddResType = UserResType;

export const UpdateUserRes = UserRes;
export type UpdateUserResType = UserResType;

export const AccountParams = z.object({
  id: z.coerce.number(),
  schoolId: z.coerce.number().optional(),
  roleId: z.coerce.number().optional(),
  accountId: z.coerce.number().optional(),
});

export const UpdateMeBody = z.object({
  email: z.string().trim().min(2).max(100),
});

export type UpdateMeBodyType = z.infer<typeof UpdateMeBody>;
