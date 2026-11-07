"use client";
import teacherApiRequest from "@/apiRequests/teacher";
import { useAppContext } from "@/app/app-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getImageSrc, handleErrorApi } from "@/lib/utils";
import { TeacherResType } from "@/schemaValidations/teacher.schema";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ButtonLogout from "../button-logout";
import { Button } from "../ui/button";

export default function MenuProfile() {
  const [information, setInformation] = useState<TeacherResType["data"]>();
  const [loading, setLoading] = useState(false);

  const { user } = useAppContext();
  const teacherId = Number(user?.teacherId);

  useEffect(() => {
    const fetchInformation = async () => {
      setLoading(true);
      try {
        const { payload } =
          await teacherApiRequest.teacher(teacherId);
          console.log(await teacherApiRequest.teacher(teacherId));
          
        setInformation(payload.data);
      } catch (error) {
        handleErrorApi({ error });
      } finally {
        setLoading(false);
      }
    };

    if (!loading && user) {
      fetchInformation();
    }
  }, [user]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className='cursor-pointer'>
        {information && (
          <Image
            src={getImageSrc(information.photoPath)}
            alt='avatar'
            className='h-8 w-8 rounded-[50%]'
            width={40}
            height={40}
            priority
          />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='start'>
        <DropdownMenuLabel>Hồ sơ</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Button size={"sm"} variant='ghost' className='w-full text-sm'>
              <Link
                href={"/me"}
                className='flex justify-between items-center w-full h-full'
              >
                Cá nhân
              </Link>
            </Button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <ButtonLogout />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
