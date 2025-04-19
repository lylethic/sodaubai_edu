import { StudentListResType } from '@/schemaValidations/student.schema';
import React, { useState } from 'react';

export default function StudentList() {
	const [loading, setLoading] = useState(false);

	const [students, setStudents] = useState<StudentListResType[]>([]);

	const [pageNumber, setPageNumber] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [totalPageCount, setTotalPageCount] = useState<number>(0);

	return <div></div>;
}
