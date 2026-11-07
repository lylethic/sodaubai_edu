"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import { useToast } from "@/hooks/use-toast";
import authApiRequest from "@/apiRequests/auth";
import { useRouter } from "next/navigation";
import { handleErrorApi } from "@/lib/utils";
import { useAppContext, useLoading } from "@/app/app-provider";

const LoginForm = () => {
  const { showLoading, hideLoading } = useLoading();
  const { setUser } = useAppContext();
  const { toast } = useToast();
  const router = useRouter();

  //
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      Email: "",
      Password: "",
    },
  });

  async function onSubmit(values: LoginBodyType) {
    showLoading();
    try {
      const result = await authApiRequest.login(values);

      await authApiRequest.auth({
        accessToken: result.payload.data.token,
        expiresAt: result.payload.data.expiresAt,
      });

      toast({
        description: result.payload.message,
      });

      const { userInfo } = result.payload.data;

      setUser({
        id: userInfo.id,
        email: userInfo.email,
        username: userInfo.username,
        avatar: userInfo.avatar,
        schoolId: userInfo.schoolId,
        schoolName: userInfo.schoolName,
        schoolType: userInfo.schoolType,
        schoolPhoneNumber: userInfo.schoolPhoneNumber,
        teacherId: userInfo.teacherId,
        fullname: userInfo.fullName,
      });
      router.push("/sodaubai");
      router.refresh();
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: form.setError,
        duration: 3000,
      });
    } finally {
      hideLoading();
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-2 max-w-[600px] flex-shrink-0 w-full'
        noValidate
      >
        <FormField
          control={form.control}
          name='Email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type='email'
                  placeholder='Nhập email người dùng...'
                  autoComplete='email'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='Password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  placeholder='Nhập mật khẩu..'
                  autoComplete='current-password'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='!mt-8 w-full'>
          Đăng nhập
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
