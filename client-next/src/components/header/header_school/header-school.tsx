'use client';

import { useEffect, useState } from 'react';
import { useAppContext } from '@/app/app-provider';
import schoolApiRequest from '@/apiRequests/school';
import { handleErrorApi } from '@/lib/utils';
import Image from 'next/image';

export default function HeaderSchool() {
	const { user } = useAppContext();
	const [school, setSchool] = useState<string>('');

	useEffect(() => {
		if (!user) return;

		const fetchSchoolName = async (schoolId: number) => {
			try {
				const { payload } = await schoolApiRequest.getNameOfSchool(schoolId);
				setSchool(payload.nameSchool);
			} catch (error) {
				handleErrorApi({ error });
			}
		};

		fetchSchoolName(user.schoolId);
	}, [user]);

	if (!user) return null;

	return (
		<div className='flex-1 flex items-center space-x-10'>
			<>
				<Image src={'/images/logo.png'} alt='30x30' width={40} height={40} />
			</>
			<div>
				<span className='text-sm uppercase font-bold'>
					sở GD&ĐT tỉnh đồng nai
				</span>
				<h3 className='uppercase font-bold'>{school}</h3>
			</div>
		</div>
	);
}
