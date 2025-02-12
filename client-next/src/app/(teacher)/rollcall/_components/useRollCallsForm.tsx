import { rollcallApiRequest } from '@/apiRequests/rollcall';
import { useToast } from '@/hooks/use-toast';
import { handleErrorApi } from '@/lib/utils';
import { CreateRollCallBodyType } from '@/schemaValidations/rollcall-schema';
import RollCallFormValues from '@/types/RollCallFormValues';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

function useRollCallForm() {
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();
	const methods = useForm<RollCallFormValues>({
		defaultValues: {
			rollCall: {
				rollCallId: 0,
				weekId: 0,
				classId: 0,
				dayOfTheWeek: '',
				numberOfAttendants: 0,
				dateAt: undefined,
			},
			absences: [],
		},
	});

	const handleCreate = async (values: RollCallFormValues) => {
		setLoading(true);
		try {
			const { payload } = await rollcallApiRequest.create(values);
			toast({ description: payload.message });
		} catch (error: any) {
			handleErrorApi({ error });
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = (values: RollCallFormValues) => {
		handleCreate(values);
		console.log(values);
	};
	return {
		methods,
		handleSubmit: methods.handleSubmit(handleSubmit),
	};
}

export default useRollCallForm;
