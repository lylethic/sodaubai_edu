"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Home,
} from "lucide-react";
import { cn } from "cn"; // same import you use in navbar.tsx
import { useAppContext } from "@/app/app-provider";

const items = [
  { title: "Trang chủ", url: "/", icon: Home },
  { title: "Sổ đầu bài", url: "/sodaubai", icon: BookOpen },
  { title: "Điểm danh", url: "/rollcall", icon: ClipboardCheck },
  { title: "Học sinh", url: "/students", icon: GraduationCap },
  { title: "Thống kê", url: "/statistics", icon: BarChart3 },
];

export default function FloatingBottomNav() {
  const { user } = useAppContext();
  const pathname = usePathname();

  if (!user) return null;

  const isActive = (url: string) =>
    url === "/" ? pathname === "/" : pathname.startsWith(url);

  return (
    <nav
      aria-label='Điều hướng chính'
      className='pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(env(safe-area-inset-bottom),1rem)] lg:hidden'
    >
      <ul className='pointer-events-auto flex w-full max-w-md items-center justify-between gap-1 rounded-full border border-white/50 bg-white/70 p-1.5 shadow-xl shadow-black/10 backdrop-blur-xl md:max-w-xl supports-[backdrop-filter]:bg-white/60'>
        {items.map(({ title, url, icon: Icon }) => {
          const active = isActive(url);
          return (
            <li key={url} className='flex-1'>
              <Link
                href={url}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 rounded-full px-2 py-2 text-[10px] font-medium text-gray-600 transition-colors md:flex-row md:gap-2 md:text-sm",
                  active
                    ? "bg-gray-300/70 text-gray-900"
                    : "hover:bg-gray-200/60",
                )}
              >
                <Icon className='size-5 shrink-0 md:size-5' />
                <span className='truncate'>{title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
