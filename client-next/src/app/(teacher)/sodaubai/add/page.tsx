import BiaSoDauBaiAddForm from '../_components/biasodaubai-add-form';

export default function SoDauBaiAddPage({
	isOpen,
	onOpenChange,
}: {
	isOpen: boolean;
	onOpenChange: (value: boolean) => void;
}) {
	return (
		<div>
			<h1 className='text-lg uppercase'>Tạo mới sổ đầu bài</h1>
			<BiaSoDauBaiAddForm
				isOpen={isOpen}
				onOpenChange={(value) => {
					onOpenChange(value);
				}}
			/>
		</div>
	);
}
