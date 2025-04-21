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

	const setAbsences = (
		data: Array<{
			studentId: number;
			isExcused: boolean;
			description: string;
		}>
	) => {
		// 1. Remove everything already there
		remove();

		// 2. Only keep items where:
		//    • isExcused is not undefined AND
		//    • description is non-empty after trimming
		const filtered = data.filter(
			(item) =>
				item.isExcused !== undefined && item.description.trim().length > 0
		);

		// 3. Re-append only the filtered items
		filtered.forEach((item) => {
			append({
				rollCallDetailId: 0,
				rollCallId: 0,
				studentId: item.studentId,
				isExcused: item.isExcused,
				description: item.description.trim(),
			});
		});
	};

	return {
		fields,
		register,
		setValue,
		watch,
		addNewRollCallDetail,
		removeRollCallDetail,
		setAbsences,
	};
}

export default useRollCallsFormFields;
