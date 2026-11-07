import accountApiRequest from "@/apiRequests/account";
import envConfig from "@/config";
import { Metadata, ResolvingMetadata } from "next";
import { cache } from "react";
import { baseOpenGraph } from "@/app/shared-metadata";
import { cookies } from "next/headers";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Check, X } from "lucide-react";
import Image from "next/image";
import { getImageSrc } from "@/lib/utils";

const getDetailAccount = cache(accountApiRequest.getUser);

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const formatDate = (dateString?: string | null) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? dateString : date.toLocaleDateString("vi-VN");
};

const formatDateTime = (dateString?: string | null) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return isNaN(date.getTime())
    ? dateString
    : `${date.toLocaleDateString("vi-VN")} ${date.toLocaleTimeString("vi-VN")}`;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) {
    return { title: "Chi tiết tài khoản" };
  }

  try {
    const { payload } = await getDetailAccount(Number(params.id), accessToken);
    const account = payload.data;
    const accountId = account.id ?? account.accountId;
    const url = `${envConfig.NEXT_PUBLIC_URL}/dashboard/accounts/${accountId}`;
    return {
      title: account.fullname || account.email,
      openGraph: {
        ...baseOpenGraph,
        title: account.fullname || account.email,
        url,
      },
      alternates: {
        canonical: url,
      },
    };
  } catch {
    return { title: "Chi tiết tài khoản" };
  }
}

export default async function AccountDetail({ params, searchParams }: Props) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");

  if (!accessToken) {
    return (
      <div className='p-6 text-center text-red-500'>
        Phiên đăng nhập hết hạn hoặc accessToken không hợp lệ.
      </div>
    );
  }

  let user: any = null;
  try {
    const { payload } = await getDetailAccount(
      Number(params.id),
      accessToken.value,
    );
    user = payload.data;
  } catch (error: any) {
    console.error("Lỗi khi lấy chi tiết tài khoản:", error);
  }

  return (
    <div className='max-w-4xl mx-auto p-6 space-y-4'>
      <div className='flex items-center gap-4'>
        <Link title='Quay lại' href='/dashboard/accounts'>
          <Button variant='outline' size='icon'>
            <ArrowLeft className='w-4 h-4' />
          </Button>
        </Link>
        <h3 className='text-sm uppercase font-bold text-gray-800'>Hồ sơ</h3>
      </div>

      {!user ? (
        <div className='text-center py-8 text-muted-foreground'>
          Không tìm thấy thông tin hồ sơ
        </div>
      ) : (
        <div className='border rounded-lg shadow-sm bg-white overflow-hidden'>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className='w-1/3 font-medium text-gray-600'>
                  Ảnh đại diện
                </TableCell>
                <TableCell>
                  {user.photoPath ? (
                    <div className='relative w-16 h-16 rounded-full overflow-hidden border'>
                      <Image
                        src={getImageSrc(user.photoPath)}
                        alt={user.fullname || "Avatar"}
                        fill
                        className='object-cover'
                        unoptimized
                      />
                    </div>
                  ) : (
                    <span className='text-muted-foreground'>Chưa có ảnh</span>
                  )}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className='font-medium text-gray-600'>
                  Mã tài khoản
                </TableCell>
                <TableCell>{user.id ?? "—"}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className='font-medium text-gray-600'>
                  Họ và tên
                </TableCell>
                <TableCell className='font-semibold'>
                  {user.fullname ?? "—"}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className='font-medium text-gray-600'>
                  Tên đăng nhập
                </TableCell>
                <TableCell>{user.username ?? "—"}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className='font-medium text-gray-600'>
                  Email
                </TableCell>
                <TableCell>{user.email ?? "—"}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className='font-medium text-gray-600'>
                  Giới tính
                </TableCell>
                <TableCell>
                  {user.gender === true
                    ? "Nam"
                    : user.gender === false
                      ? "Nữ"
                      : "Khác"}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className='font-medium text-gray-600'>
                  Ngày sinh
                </TableCell>
                <TableCell>{formatDate(user.dateOfBirth)}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className='font-medium text-gray-600'>
                  Địa chỉ
                </TableCell>
                <TableCell>{user.address ?? "—"}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className='font-medium text-gray-600'>
                  Vai trò
                </TableCell>
                <TableCell>
                  <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800'>
                    {user.nameRole ?? `Mã vai trò: ${user.roleId}`}
                  </span>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className='font-medium text-gray-600'>
                  Mã giáo viên
                </TableCell>
                <TableCell>{user.teacherId ?? "—"}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className='font-medium text-gray-600'>
                  Trường học
                </TableCell>
                <TableCell>
                  <div className='space-y-1'>
                    <div className='font-medium'>
                      {user.schoolName ?? `Mã trường: ${user.schoolId}`}
                    </div>
                    {user.schoolType && (
                      <div className='text-sm text-gray-500'>
                        Loại trường: {user.schoolType}
                      </div>
                    )}
                    {user.schoolPhoneNumber && (
                      <div className='text-sm text-gray-500'>
                        SĐT trường: {user.schoolPhoneNumber}
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className='font-medium text-gray-600'>
                  Trạng thái
                </TableCell>
                <TableCell>
                  {user.status ? (
                    <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800'>
                      Hoạt động <Check className='w-3.5 h-3.5' />
                    </span>
                  ) : (
                    <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-700'>
                      Ngưng hoạt động <X className='w-3.5 h-3.5' />
                    </span>
                  )}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className='font-medium text-gray-600'>
                  Ngày tạo
                </TableCell>
                <TableCell>{formatDateTime(user.dateCreated)}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className='font-medium text-gray-600'>
                  Cập nhật lần cuối
                </TableCell>
                <TableCell>{formatDateTime(user.dateUpdated)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
