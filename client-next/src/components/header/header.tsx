"use client";

import Link from "next/link";
import { useAppContext } from "@/app/app-provider";
import { NavbarNormalUserComponent } from "./navbar";
import MenuProfile from "./menu-profile";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { LogIn, UserPlus, UserRound } from "lucide-react";

export default function Header() {
  const { user } = useAppContext();

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-white/80 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/60'>
      <div className='mx-auto flex w-full items-center justify-between gap-3 p-2 lg:p-0 xl-p-0 lg:w-3/4'>
        <div className='flex-1'>
          <NavbarNormalUserComponent />
        </div>

        {!user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                aria-label='Mở menu tài khoản'
                className='rounded-full border-gray-200 transition-colors hover:bg-gray-100'
              >
                <UserRound className='h-5 w-5' />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align='end'
              sideOffset={10}
              className='w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-xl'
            >
              <DropdownMenuLabel className='px-3 py-2 text-xs font-medium text-gray-500'>
                TÀI KHOẢN CỦA BẠN
              </DropdownMenuLabel>

              <DropdownMenuSeparator className='bg-gray-100' />

              <DropdownMenuItem
                asChild
                className='cursor-pointer rounded-lg px-3 py-2.5 outline-none transition-colors focus:bg-gray-100'
              >
                <Link href='/login' className='flex items-center gap-3'>
                  <span className='flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600'>
                    <LogIn className='h-4 w-4' />
                  </span>

                  <span className='flex flex-col gap-0.5'>
                    <span className='text-sm font-medium text-gray-800'>
                      Đăng nhập
                    </span>
                    <span className='text-xs text-gray-500'>
                      Truy cập tài khoản của bạn
                    </span>
                  </span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                asChild
                className='cursor-pointer rounded-lg px-3 py-2.5 outline-none transition-colors focus:bg-gray-100'
              >
                <Link href='/register' className='flex items-center gap-3'>
                  <span className='flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600'>
                    <UserPlus className='h-4 w-4' />
                  </span>

                  <span className='flex flex-col gap-0.5'>
                    <span className='text-sm font-medium text-gray-800'>
                      Đăng ký
                    </span>
                    <span className='text-xs text-gray-500'>
                      Tạo tài khoản mới
                    </span>
                  </span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <MenuProfile />
        )}
      </div>
    </header>
  );
}
