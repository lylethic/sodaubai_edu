//server nextjs

export async function POST(request: Request) {
	const body = await request.json();

	const accessToken = body.accessToken as string;
	const expiresAt = body.expiresAt as string;

	// Check if decodeToken is null
	if (!accessToken) {
		return Response.json(
			{ message: 'Invalid accessToken' },
			{
				status: 400,
			}
		);
	}
	const expiresDate = new Date(expiresAt).toUTCString();

	return Response.json(body, {
		status: 200,
		headers: {
			// Set cookies for the tokens
			'Set-Cookie': `accessToken=${accessToken}; Path=/; HttpOnly; Expires=${expiresDate}; SameSite=Lax; Secure`,
			'Content-Type': 'application/json',
		},
	});
}
