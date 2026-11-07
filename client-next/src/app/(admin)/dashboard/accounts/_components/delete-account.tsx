"use client";

import React from "react";
import { useToast } from "@/hooks/use-toast";
import { AccountType } from "@/types/accountType";
import accountApiRequest from "@/apiRequests/account";
import { handleErrorApi } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function DeleteAccount({
  user,
  open,
  onOpenChange,
  onDelete,
}: {
  user: AccountType | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onDelete: (userId: number) => void;
}) {
  const { toast } = useToast();

  const deleteAccount = async () => {
    if (!user) return;
    try {
      const result = await accountApiRequest.deleteAccount(user.id);
      toast({ description: result.payload.message });

      onDelete(user.id);
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {!open && (
        <AlertDialogTrigger asChild>
          <Button
            type='button'
            variant={"ghost"}
            title='Xóa'
            className='justify-start w-full'
          >
            Xóa
          </Button>
        </AlertDialogTrigger>
      )}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có muốn xóa tài khoản?</AlertDialogTitle>
          <AlertDialogDescription>
            Tài khoản &rdquo;{user?.email ?? ""}&rdquo; sẽ bị xóa vĩnh viễn.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction color='red' onClick={deleteAccount}>
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
