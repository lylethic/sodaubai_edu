import { useFieldArray, useFormContext } from 'react-hook-form';
import RollCallFormValues from '@/types/RollCallFormValues';

function useRollCallsFormFields() {
	const { control, register, setValue, watch } =
		useFormContext<RollCallFormValues>();

	const { fields, append, remove } = useFieldArray<RollCallFormValues>({
		control,
		name: 'absences',
	});

	const addNewRollCallDetail = () => {
		append({
			rollCallDetailId: 0,
			rollCallId: 0,
			studentId: 0,
			description: '',
			isExcused: false,
		});
	};

	const removeRollCallDetail = (friendIndex: number) => () => {
		remove(friendIndex);
	};

	return {
		fields,
		register,
		setValue,
		watch,
		addNewRollCallDetail,
		removeRollCallDetail,
	};
}

export default useRollCallsFormFields;
