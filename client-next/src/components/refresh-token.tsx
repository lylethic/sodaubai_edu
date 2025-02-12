'use client';

import React, { useEffect } from 'react';
import authApiRequest from '@/apiRequests/auth';
import { differenceInHours } from 'date-fns';

export default function RefreshToken() {
	useEffect(() => {
		const interval = setInterval(async () => {
			const now = new Date();

			const accessTokenExpiresAt = localStorage.getItem(
				'jwtAccessTokenExpiredAt'
			);
			const expiresAt = accessTokenExpiresAt
				? new Date(accessTokenExpiresAt)
				: new Date();

			if (differenceInHours(expiresAt, now) < 1) {
				const res =
					await authApiRequest.slideSessionFromNextClientToNextServer();
				localStorage.setItem(
					'jwtAccessTokenExpiredAt',
					res.payload.data.expiresAt
				);
			}
		}, 1000 * 60 * 60);
		return () => clearInterval(interval);
	}, []);

	return null;
}

// 'use client';

// import React, { useEffect, useState } from 'react';
// import authApiRequest from '@/apiRequests/auth';
// import { differenceInHours } from 'date-fns';

// export default function RefreshToken() {
// 	const [manualRefreshResult, setManualRefreshResult] = useState<string | null>(
// 		null
// 	);

// 	useEffect(() => {
// 		// Automatic token refresh every hour
// 		const interval = setInterval(async () => {
// 			const now = new Date();

// 			const accessTokenExpiresAt = localStorage.getItem(
// 				'jwtAccessTokenExpiredAt'
// 			);
// 			const expiresAt = accessTokenExpiresAt
// 				? new Date(accessTokenExpiresAt)
// 				: new Date();

// 			if (differenceInHours(expiresAt, now) < 1) {
// 				try {
// 					const res =
// 						await authApiRequest.slideSessionFromNextClientToNextServer();
// 					localStorage.setItem(
// 						'jwtAccessTokenExpiredAt',
// 						res.payload.data.expiresAt
// 					);
// 				} catch (error) {
// 					console.error('Automatic refresh failed:', error);
// 				}
// 			}
// 		}, 1000 * 60 * 60); // Check every hour

// 		return () => clearInterval(interval);
// 	}, []);

// 	// Manual refresh function
// 	const handleManualRefresh = async () => {
// 		try {
// 			const res = await authApiRequest.slideSessionFromNextClientToNextServer();
// 			localStorage.setItem(
// 				'jwtAccessTokenExpiredAt',
// 				res.payload.data.expiresAt
// 			);
// 			setManualRefreshResult(
// 				'Refresh successful: ' + JSON.stringify(res.payload)
// 			);
// 		} catch (error) {
// 			console.error('Manual refresh failed:', error);
// 			setManualRefreshResult('Refresh failed: ' + error);
// 		}
// 	};

// 	return (
// 		<div>
// 			{/* Button for manual refresh */}
// 			<button onClick={handleManualRefresh}>Refresh Token Manually</button>

// 			{/* Display manual refresh result */}
// 			{manualRefreshResult && <p>{manualRefreshResult}</p>}
// 		</div>
// 	);
// }
