"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "cn";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useAppContext } from "@/app/app-provider";
import { useEffect, useState } from "react";
import schoolApiRequest from "@/apiRequests/school";
import { handleErrorApi } from "@/lib/utils";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface NavbarNormalUserProps {
  className?: string;
  logo: {
    url: string;
    src: string;
    alt: string;
    title: string;
    className?: string;
  };
  menu: MenuItem[];
  auth: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
}

const defaultProps: NavbarNormalUserProps = {
  logo: {
    url: "/",
    src: "/images/logo.png",
    alt: "logo",
    title: "Sở GD&ĐT tỉnh đồng nai",
  },
  menu: [
    { title: "Trang chủ", url: "/" },
    {
      title: "Sổ đầu bài",
      url: "/sodaubai",
      //   items: [
      //     {
      //       title: "Blog",
      //       description: "The latest industry news, updates, and info",
      //       icon: <Book className='size-5 shrink-0' />,
      //       url: "#",
      //     }
      //   ],
    },
    {
      title: "Điểm danh",
      url: "/rollcall",
    },
    {
      title: "Học sinh",
      url: "/students",
    },
    {
      title: "Thống kê",
      url: "/statistics",
    },
  ],
  auth: {
    login: { title: "Đăng nhập", url: "/login" },
    signup: { title: "Đăng ký", url: "/register" },
  },
};

const NavbarNormalUserComponent = ({
  className,
  ...props
}: Partial<NavbarNormalUserProps>) => {
  const { logo, menu } = {
    ...defaultProps,
    ...props,
  };
  const { user } = useAppContext();
  const [school, setSchool] = useState<string>("");

  useEffect(() => {
    if (!user) return;

    const fetchSchoolName = async (schoolId: number) => {
      try {
        const { payload } = await schoolApiRequest.getNameOfSchool(schoolId);
        const name =
          (payload as any)?.data?.nameSchool ??
          (payload as any)?.data?.name ??
          (payload as any)?.nameSchool ??
          "";
        setSchool(name);
      } catch (error) {
        handleErrorApi({ error });
      }
    };

    if (user?.schoolId) {
      fetchSchoolName(user.schoolId);
    }
  }, [user]);

  if (!user) return null;
  return (
    <section className={cn("py-4", className)}>
      <div className='container'>
        <nav className='hidden grid-cols-[1fr_auto_1fr] items-center lg:grid'>
          <Link
            href={logo.url}
            className='flex items-center gap-2 justify-self-start'
          >
            <Image
              src={logo.src}
              className='max-h-8 dark:invert'
              alt={logo.alt}
              width={40}
              height={40}
            />

            <div>
              <span className='text-sm font-semibold uppercase tracking-tighter'>
                {logo.title}
              </span>
              <h3 className='uppercase font-semibold'>{school}</h3>
            </div>
          </Link>
          <NavigationMenu className='justify-self-center'>
            <NavigationMenuList>
              {menu.map((item) => renderMenuItem(item))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* <div className='block lg:hidden'>
          <div className='flex items-center justify-between'>
            <Link href={logo.url} className='flex items-center gap-2'>
              <Image
                src={logo.src}
                className='max-h-8 dark:invert'
                alt={logo.alt}
                width={40}
                height={40}
              />
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant='outline' size='icon'>
                  <Menu className='size-4' />
                </Button>
              </SheetTrigger>
              <SheetContent className='overflow-y-auto'>
                <SheetHeader>
                  <SheetTitle>
                    <Link href={logo.url} className='flex items-center gap-2'>
                      <Image
                        src={logo.src}
                        className='max-h-8 dark:invert'
                        alt={logo.alt}
                        width={40}
                        height={40}
                      />
                      <h3 className='uppercase font-bold'>{school}</h3>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className='flex flex-col gap-6 p-4'>
                  <Accordion
                    type='single'
                    className='flex w-full flex-col gap-4'
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div> */}
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className='bg-popover text-popover-foreground'>
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className='w-80'>
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className='group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground'
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

// const renderMobileMenuItem = (item: MenuItem) => {
//   if (item.items) {
//     return (
//       <AccordionItem key={item.title} value={item.title} className='border-b-0'>
//         <AccordionTrigger className='text-md py-0 font-semibold hover:no-underline'>
//           {item.title}
//         </AccordionTrigger>
//         <AccordionContent className='mt-2'>
//           {item.items.map((subItem) => (
//             <SubMenuLink key={subItem.title} item={subItem} />
//           ))}
//         </AccordionContent>
//       </AccordionItem>
//     );
//   }

//   return (
//     <a key={item.title} href={item.url} className='text-md font-semibold'>
//       {item.title}
//     </a>
//   );
// };

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <Link
      className='flex min-w-80 flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground'
      href={item.url}
    >
      <div className='text-foreground'>{item.icon}</div>
      <div>
        <div className='text-sm font-semibold'>{item.title}</div>
        {item.description && (
          <p className='text-sm leading-snug text-muted-foreground'>
            {item.description}
          </p>
        )}
      </div>
    </Link>
  );
};

export { NavbarNormalUserComponent };
