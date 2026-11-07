import Header from "@/components/header/header";
import FloatingBottomNav from "@/components/header/header-floating-navbar";
import React from "react";

export default function TeacherLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='h-dvh w-full overflow-y-auto'>
        <Header />

        <main className='mx-auto w-full max-w-7xl px-4 pb-28 lg:pb-6'>
            <div>{children}</div>
        </main>

        <FloatingBottomNav />
    </div>
  );
}
