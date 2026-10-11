'use client';

import React, { useEffect, useState } from 'react';
import authApiRequest from '@/apiRequests/auth';
import Image from 'next/image';
import { useAppContext } from '@/app/app-provider';
import Link from 'next/link';
import { getImageSrc, handleErrorApi } from '@/lib/utils';
import { MyInfoDto } from '@/schemaValidations/auth.schema';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Shield,
  School,
  User,
  Mail,
  Calendar,
  MapPin,
  Images,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

export default function MeProfile() {
  const [information, setInformation] = useState<MyInfoDto | null>(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAppContext();

  useEffect(() => {
    const fetchInformation = async () => {
      setLoading(true);
      try {
        const username = user?.username || user?.email || undefined;
        const { payload } = await authApiRequest.getMyInfo(username);
        setInformation(payload.data);
      } catch (error) {
        handleErrorApi({ error });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchInformation();
    }
  }, [user]);

  // Role determination for navigation
  const roleId = Number(user?.roleId);
  const isAdmin = roleId === 6 || roleId === 7;
  const homeUrl = isAdmin ? '/dashboard' : '/sodaubai';

  const [imgError, setImgError] = useState(false);
  const rawAvatar = information?.photoPath || information?.avatar;
  const avatarSrc = rawAvatar && !imgError ? getImageSrc(rawAvatar) : '/images/programmer.png';

  return (
    <div className='max-w-5xl mx-auto space-y-6'>
      {/* Top Action Bar */}
      <div className='flex items-center justify-between border-b pb-4'>
        <Link href={homeUrl}>
          <Button
            variant='outline'
            type='button'
            className='flex items-center gap-2'
          >
            <ArrowLeft className='h-4 w-4' />
            Trang chủ
          </Button>
        </Link>

        {information?.teacherId && (
          <Link href={`/me/${information.teacherId}`}>
            <Button
              variant='default'
              type='button'
              className='bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-2'
            >
              Chỉnh sửa thông tin
              <ArrowRight className='h-4 w-4' />
            </Button>
          </Link>
        )}
      </div>

      {loading ? (
        <div className='flex flex-col items-center justify-center py-20 space-y-3'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
          <span className='text-sm text-muted-foreground'>
            Đang tải thông tin cá nhân...
          </span>
        </div>
      ) : !information ? (
        <div className='text-center py-12 text-muted-foreground'>
          Không tìm thấy thông tin tài khoản
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Left Column: Avatar & Summary Card */}
          <Card className='col-span-1 shadow-sm border'>
            <CardHeader className='text-center pb-2'>
              <CardTitle className='text-lg font-bold'>
                {information.fullname || information.username || 'Người dùng'}
              </CardTitle>
              <CardDescription className='text-xs'>
                {information.email}
              </CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col items-center space-y-4 pt-2'>
              <div className='relative w-36 h-36 rounded-full overflow-hidden border-4 border-muted shadow-inner flex items-center justify-center bg-muted/40'>
                {avatarSrc ? (
                  <Image
                    src={avatarSrc}
                    className='object-cover'
                    alt={`Avatar của ${information.fullname || information.username}`}
                    fill
                    sizes='144px'
                    priority
                    unoptimized={avatarSrc.includes('localhost') || avatarSrc.includes('127.0.0.1')}
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <Images className='h-12 w-12 text-muted-foreground' />
                )}
              </div>

              <div className='w-full space-y-2 pt-2 text-sm'>
                <div className='flex items-center justify-between p-2 rounded-lg bg-muted/50'>
                  <span className='text-muted-foreground flex items-center gap-1.5'>
                    <Shield className='h-4 w-4' /> Vai trò
                  </span>
                  <span className='font-semibold'>
                    {isAdmin
                      ? 'Quản trị viên'
                      : information.teacherId
                        ? 'Giáo viên'
                        : 'Người dùng'}
                  </span>
                </div>

                {information.schoolName && (
                  <div className='flex items-center justify-between p-2 rounded-lg bg-muted/50'>
                    <span className='text-muted-foreground flex items-center gap-1.5'>
                      <School className='h-4 w-4' /> Trường
                    </span>
                    <span
                      className='font-semibold text-right truncate max-w-[150px]'
                      title={information.schoolName}
                    >
                      {information.schoolName}
                    </span>
                  </div>
                )}

                <div className='flex items-center justify-between p-2 rounded-lg bg-muted/50'>
                  <span className='text-muted-foreground flex items-center gap-1.5'>
                    Trạng thái
                  </span>
                  {(information.status ?? true) ? (
                    <span className='inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400'>
                      <Check className='h-3.5 w-3.5' /> Hoạt động
                    </span>
                  ) : (
                    <span className='text-xs text-rose-500 font-medium'>
                      Ngưng hoạt động
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column: Detailed Info Table */}
          <Card className='col-span-1 md:col-span-2 shadow-sm border'>
            <CardHeader>
              <CardTitle className='text-lg font-bold flex items-center gap-2'>
                <User className='h-5 w-5 text-primary' />
                Chi tiết tài khoản
              </CardTitle>
              <CardDescription>
                Thông tin người dùng và phân quyền trong hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent className='p-0'>
              <Table>
                <TableBody>
                  {/* <TableRow>
                    <TableCell className='font-medium text-muted-foreground w-1/3'>
                      Mã tài khoản (User ID)
                    </TableCell>
                    <TableCell className='font-semibold'>
                      {information.id}
                    </TableCell>
                  </TableRow> */}

                  {information.username && (
                    <TableRow>
                      <TableCell className='font-medium text-muted-foreground'>
                        Tên tài khoản (Username)
                      </TableCell>
                      <TableCell className='font-semibold'>
                        {information.username}
                      </TableCell>
                    </TableRow>
                  )}

                  <TableRow>
                    <TableCell className='font-medium text-muted-foreground'>
                      Email đăng nhập
                    </TableCell>
                    <TableCell className='font-semibold flex items-center gap-1.5'>
                      <Mail className='h-4 w-4 text-muted-foreground' />
                      {information.email}
                    </TableCell>
                  </TableRow>

                  {information.fullname && (
                    <TableRow>
                      <TableCell className='font-medium text-muted-foreground'>
                        Họ và tên
                      </TableCell>
                      <TableCell className='font-semibold'>
                        {information.fullname}
                      </TableCell>
                    </TableRow>
                  )}

                  {information.teacherId && (
                    <TableRow>
                      <TableCell className='font-medium text-muted-foreground'>
                        Mã giáo viên (Teacher ID)
                      </TableCell>
                      <TableCell className='font-semibold'>
                        {information.teacherId}
                      </TableCell>
                    </TableRow>
                  )}

                  {information.schoolId && (
                    <TableRow>
                      <TableCell className='font-medium text-muted-foreground'>
                        Mã trường học
                      </TableCell>
                      <TableCell className='font-semibold'>
                        {information.schoolId}
                      </TableCell>
                    </TableRow>
                  )}

                  {information.schoolName && (
                    <TableRow>
                      <TableCell className='font-medium text-muted-foreground'>
                        Tên trường
                      </TableCell>
                      <TableCell className='font-semibold'>
                        {information.schoolName}
                      </TableCell>
                    </TableRow>
                  )}

                  {information.dateOfBirth && (
                    <TableRow>
                      <TableCell className='font-medium text-muted-foreground'>
                        Ngày sinh
                      </TableCell>
                      <TableCell className='font-semibold flex items-center gap-1.5'>
                        <Calendar className='h-4 w-4 text-muted-foreground' />
                        {new Date(information.dateOfBirth).toLocaleDateString(
                          'vi-VN',
                        )}
                      </TableCell>
                    </TableRow>
                  )}

                  {information.gender !== null &&
                    information.gender !== undefined && (
                      <TableRow>
                        <TableCell className='font-medium text-muted-foreground'>
                          Giới tính
                        </TableCell>
                        <TableCell className='font-semibold'>
                          {information.gender ? 'Nam' : 'Nữ'}
                        </TableCell>
                      </TableRow>
                    )}

                  {information.address && (
                    <TableRow>
                      <TableCell className='font-medium text-muted-foreground'>
                        Địa chỉ
                      </TableCell>
                      <TableCell className='font-semibold flex items-center gap-1.5'>
                        <MapPin className='h-4 w-4 text-muted-foreground' />
                        {information.address}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
