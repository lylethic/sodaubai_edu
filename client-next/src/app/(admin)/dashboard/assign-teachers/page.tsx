import AssignTeachersList from './_components/assign-teachers-list';

// Phan cong chu nhiem page
export default function AssignTeachersPage() {
	return (
		<div className='block w-full overflow-x-auto'>
			<h1 className='text-xl text-center uppercase p-2 border-b'>
				danh sách phân công chủ nhiệm
			</h1>
			<AssignTeachersList />
		</div>
	);
}
