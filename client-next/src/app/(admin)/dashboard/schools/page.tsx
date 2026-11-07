import React from 'react';
import { cookies } from 'next/headers';
import schoolApiRequest from '@/apiRequests/school';
import SchoolsList from './_components/school-list';
import { SchoolResType } from '@/schemaValidations/school.schema';

type SchoolType = SchoolResType['data'];

export default async function SchoolsPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('accessToken')?.value;

  let initialSchools: SchoolType[] = [];
  let initialTotalCount = 0;

  if (token) {
    try {
      const res = await schoolApiRequest.getSchools(1, 20, token);
      const payload = res.payload;
      initialSchools =
        payload?.data?.items ||
        (Array.isArray(payload?.data) ? payload.data : []);
      initialTotalCount = payload?.data?.totalCount ?? initialSchools.length;
    } catch (error) {
      console.error('Failed to load schools on server', error);
    }
  }

  return (
    <div className='block w-full overflow-x-auto'>
      <h1 className='text-2xl text-center uppercase p-2 border-b'>
        Danh sách trường học
      </h1>
      <SchoolsList
        initialSchools={initialSchools}
        initialTotalCount={initialTotalCount}
      />
    </div>
  );
}
