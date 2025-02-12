import WeekList from './_components/week-list';

export default function WeeksPage() {
	return (
		<div className='block w-full overflow-x-auto'>
			<h1 className='text-xl text-center uppercase p-2'>Danh sách tuần học</h1>
			<WeekList />
		</div>
	);
}
