'use client';

import React from 'react';
import { FormProvider } from 'react-hook-form';
import useRollCallForm from './useRollCallsForm';
import RollCallsFormField from './RollCallsFormField';
import { Button } from '@/components/ui/button';

const RollCallForm = () => {
	const { handleSubmit, methods } = useRollCallForm();
	return (
		<FormProvider {...methods}>
			<form onSubmit={handleSubmit}>
				<RollCallsFormField />
				<Button size={'lg'} type='submit' className='flex mt-4 mb-2'>
					Lưu
				</Button>
			</form>
		</FormProvider>
	);
};

export default RollCallForm;
