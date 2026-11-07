"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Eye, MoreHorizontal, Pencil, Trash2, User } from "lucide-react";

import accountApiRequest from "@/apiRequests/account";
import { useAppContext } from "@/app/app-provider";
import { PaginationWithLinks } from "@/components/pagination-with-links";
import { getImageSrc, handleErrorApi } from "@/lib/utils";
import { AccountType } from "@/types/accountType";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import AccountUploadButton from "./account-upload";
import BulkDeleteAccount from "./delete-bulk";
import DeleteAccount from "./delete-account";
import FilterAccountBySchool from "./filter-account-by-schoolId";

interface AccountListProps {
  initialAccounts?: AccountType[];
  initialTotalCount?: number;
}

export default function AccountList({
  initialAccounts = [],
  initialTotalCount = 0,
}: AccountListProps) {
  const { user } = useAppContext();

  const [accounts, setAccounts] = useState<AccountType[]>(initialAccounts);
  const [selectedAccounts, setSelectedAccounts] = useState<number[]>([]);
  const [accountToDelete, setAccountToDelete] = useState<AccountType | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  const [totalCount, setTotalCount] = useState<number>(initialTotalCount);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [selectedSchoolId, setSelectedSchoolId] = useState<number>(0);

  const role = Number(user?.roleId);
  const isSchoolScopedRole = role === 6 || role === 7; // backend scopes these by token
  const isFirstMount = useRef(true);

  // Debounce the search box and go back to page 1 when the keyword changes
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedKeyword(keyword.trim());
      setPageNumber(1);
    }, 400);
    return () => clearTimeout(t);
  }, [keyword]);

  // Fetch users whenever page, size, school or keyword changes
  useEffect(() => {
    // Reuse server-rendered data on first load
    if (isFirstMount.current) {
      isFirstMount.current = false;
      if (
        initialAccounts.length > 0 &&
        selectedSchoolId === 0 &&
        debouncedKeyword === "" &&
        pageNumber === 1 &&
        pageSize === 20
      ) {
        return;
      }
    }

    let ignore = false; // prevents stale responses from overwriting newer ones

    const fetchAccounts = async () => {
      setLoading(true);
      try {
        const response = await accountApiRequest.getUsers({
          pageNumber,
          pageSize,
          keyword: debouncedKeyword || null,
          schoolId: isSchoolScopedRole ? null : selectedSchoolId || null,
        });

        if (ignore) return;

        const { items, totalCount } = response.payload.data;

        setAccounts(
          items.map((u: any) => ({ ...u, accountId: u.id })) as AccountType[],
        );
        setTotalCount(totalCount ?? 0);
        setSelectedAccounts([]);
      } catch (error: any) {
        if (!ignore) handleErrorApi({ error });
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchAccounts();

    return () => {
      ignore = true;
    };
  }, [
    pageNumber,
    pageSize,
    selectedSchoolId,
    debouncedKeyword,
    isSchoolScopedRole,
  ]);

  const handleFilterChange = (schoolId: number | null) => {
    setSelectedSchoolId(schoolId ?? 0);
    setPageNumber(1);
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedAccounts((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedAccounts.length === accounts.length) {
      setSelectedAccounts([]);
    } else {
      setSelectedAccounts(accounts.map((a) => a.accountId));
    }
  };

  // After bulk delete
  const handleDeleteSuccess = (deletedIds: number[]) => {
    setAccounts((prev) =>
      prev.filter((a) => !deletedIds.includes(a.accountId)),
    );
    setSelectedAccounts([]);
    setTotalCount((c) => Math.max(0, c - deletedIds.length));
  };

  // After deleting one record
  const handleDeleteAccount = (accountId: number) => {
    setAccounts((prev) => prev.filter((a) => a.accountId !== accountId));
    setTotalCount((c) => Math.max(0, c - 1));
    setAccountToDelete(null);
  };

  const renderAvatar = (avatar?: string | null, name?: string | null) => {
    if (avatar) {
      return (
        <Image
          src={getImageSrc(avatar)}
          alt={name || "Avatar"}
          className='w-8 h-8 rounded-full object-cover border'
          width={40}
          height={40}
        />
      );
    }
    return (
      <div className='w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground'>
        <User className='w-4 h-4' />
      </div>
    );
  };

  return (
    <>
      <AccountUploadButton />

      <div className='flex flex-col gap-3 sm:flex-row sm:items-center my-4'>
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder='Tìm theo email hoặc họ tên...'
          className='max-w-sm'
        />

        {!isSchoolScopedRole && (
          <FilterAccountBySchool
            schoolId={selectedSchoolId}
            onFilterChange={handleFilterChange}
            onReset={() => handleFilterChange(null)}
          />
        )}
      </div>

      <BulkDeleteAccount
        selected={selectedAccounts}
        onDeleted={handleDeleteSuccess}
      />

      <div className='relative overflow-x-auto shadow-md'>
        <Table className='w-full table-auto border-collapse min-w-[1000px] my-4 rounded-lg border'>
          <TableHeader className='border-b text-left text-gray-400'>
            <TableRow>
              <TableHead scope='col' className='ps-4 py-3'>
                <Checkbox
                  onCheckedChange={handleSelectAll}
                  checked={
                    accounts.length > 0 &&
                    selectedAccounts.length === accounts.length
                  }
                />
              </TableHead>
              <TableHead>STT</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Avatar</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Họ tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Trường học</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Ngày cập nhật</TableHead>
              <TableHead className='text-center'>Chức năng</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading && accounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} className='text-center py-6'>
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : accounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} className='text-center py-6'>
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              accounts.map((item, index) => (
                <TableRow
                  key={item.accountId}
                  className={loading ? "opacity-60" : ""}
                >
                  <TableCell>
                    <div className='flex items-center'>
                      <Input
                        id={`checkbox-account-${item.accountId}`}
                        type='checkbox'
                        className='w-4 h-4 ms-2'
                        onChange={() => handleCheckboxChange(item.accountId)}
                        checked={selectedAccounts.includes(item.accountId)}
                      />
                      <Label
                        htmlFor={`checkbox-account-${item.accountId}`}
                        className='sr-only'
                      >
                        checkbox
                      </Label>
                    </div>
                  </TableCell>
                  <TableCell>
                    {index + 1 + (pageNumber - 1) * pageSize}
                  </TableCell>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>
                    {renderAvatar(
                      item.avatar ?? item.photoPath,
                      item.username || item.email,
                    )}
                  </TableCell>
                  <TableCell>{item.username || "-"}</TableCell>
                  <TableCell>{item.fullname || "-"}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.nameRole || "-"}</TableCell>
                  <TableCell>{item.schoolName || "-"}</TableCell>
                  <TableCell>
                    {item.dateCreated
                      ? format(new Date(item.dateCreated), "dd/MM/yyyy")
                      : ""}
                  </TableCell>
                  <TableCell>
                    {item.dateUpdated
                      ? format(new Date(item.dateUpdated), "dd/MM/yyyy")
                      : ""}
                  </TableCell>
                  <TableCell className='p-2 text-center'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon' className='h-8 w-8'>
                          <span className='sr-only'>Mở menu</span>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>

                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/accounts/${item.accountId}`}>
                            <Eye className='mr-2 h-4 w-4 text-green-600' />
                            Xem chi tiết
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link
                            href={`/dashboard/accounts/${item.accountId}/edit`}
                          >
                            <Pencil className='mr-2 h-4 w-4 text-yellow-600' />
                            Chỉnh sửa
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className='text-red-600 focus:text-red-600'
                          onSelect={() => setAccountToDelete(item)}
                        >
                          <Trash2 className='mr-2 h-4 w-4' />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <PaginationWithLinks
          page={pageNumber}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={(newPage) => setPageNumber(newPage)}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPageNumber(1);
          }}
          pageSizeSelectOptions={{ pageSizeOptions: [5, 10, 20, 50] }}
        />
      </div>

      {/* One delete dialog for the whole table, controlled by state */}
      <DeleteAccount
        user={accountToDelete}
        open={!!accountToDelete}
        onOpenChange={(open) => !open && setAccountToDelete(null)}
        onDelete={handleDeleteAccount}
      />
    </>
  );
}
