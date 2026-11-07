import { Metadata } from 'next';
import CardUser from '../../../components/card/user';

export const metadata: Metadata = {
	title: 'Sổ đầu bài',
	description: 'Sổ đầu bài điện tử',
};

function AdminLayout() {
	return (
		<>
			<CardUser />
		</>
	);
}

export default AdminLayout;
