import { cache } from "react";
import { cookies } from "next/headers";
import envConfig from "@/config";
import { Metadata, ResolvingMetadata } from "next";
import { baseOpenGraph } from "@/app/shared-metadata";
import accountApiRequest from "@/apiRequests/account";
import EditAccountForm from "../../_components/edit-account-form";

const getDetailAccount = cache(accountApiRequest.getUser);

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")!.value;
  const { payload } = await getDetailAccount(Number(params.id), accessToken);

  const user = payload.data;
  const userId = user.id ?? user.accountId;
  const url = envConfig.NEXT_PUBLIC_URL + "/dashboard/accounts/" + userId;
  return {
    title: user.email,
    openGraph: {
      ...baseOpenGraph,
      title: user.email,
      url,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function AccountEditPage({ params }: Props) {
  const cookieStore = cookies();
  const token = cookieStore.get("accessToken");

  let user = null;
  if (!token) return;
  try {
    const { payload } = await getDetailAccount(Number(params.id), token.value);
    user = payload.data;
  } catch (error: any) {
    console.error(error);
  }

  return (
    <div className='py-6'>
      <h3 className='text-center text-sm font-medium uppercase'>
        cập nhật hồ sơ
      </h3>
      <div className='flex items-center justify-center'>
        {!user ? (
          <div>Không tìm thấy hồ sơ</div>
        ) : (
          <EditAccountForm params={params} user={user} />
        )}
      </div>
    </div>
  );
}
