import {
	HomeIcon,
	User2Icon,
	BellIcon,
	BookAIcon,
	UserCircleIcon,
	UserCog2,
	Shapes,
	BookOpen,
	School,
	Calendar,
	CalendarCog,
	RollerCoaster,
	NotebookText,
	FerrisWheel,
	Handshake,
	School2,
} from 'lucide-react';
import React from 'react';

interface SidebarNavItem {
	href: string;
	icon: React.ElementType;
	title: string;
}

export const sidebarNavItems: SidebarNavItem[] = [
	{
		href: '/dashboard',
		icon: HomeIcon,
		title: 'trang chủ',
	},
	{
		href: '/dashboard/accounts',
		icon: User2Icon,
		title: 'tài khoản',
	},
	{
		href: '/dashboard/notify',
		icon: BellIcon,
		title: 'thông báo',
	},
	{
		href: '/dashboard/reports',
		icon: BookAIcon,
		title: 'báo cáo',
	},
	{
		href: '/dashboard/assign-teachers',
		icon: Handshake,
		title: 'Phân công chủ nhiệm',
	},
	{
		href: '/dashboard/teaching-assignments',
		icon: Handshake,
		title: 'Phân công giảng dạy',
	},
	{
		href: '/dashboard/teachers',
		icon: UserCircleIcon,
		title: 'giáo viên',
	},
	{
		href: '/dashboard/students',
		icon: UserCog2,
		title: 'học sinh',
	},
	{
		href: '/dashboard/classes',
		icon: FerrisWheel,
		title: 'lớp học',
	},
	{
		href: '/dashboard/sodaubais',
		icon: NotebookText,
		title: 'sổ đầu bài',
	},
	{
		href: '/dashboard/semesters',
		icon: RollerCoaster,
		title: 'học kỳ',
	},
	{
		href: '/dashboard/academicyears',
		icon: CalendarCog,
		title: 'niên khóa',
	},
	{
		href: '/dashboard/weeks',
		icon: Calendar,
		title: 'tuần học',
	},
	{
		href: '/dashboard/schools',
		icon: School,
		title: 'trường học',
	},
	{
		href: '/dashboard/subjects',
		icon: BookOpen,
		title: 'môn học',
	},
	{
		href: '/dashboard/grades',
		icon: School2,
		title: 'Khối lớp',
	},
	{
		href: '/dashboard/xep-loai-tiet-hoc',
		icon: Shapes,
		title: 'xếp loại',
	},
];
