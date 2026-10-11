/** @type {import('next').NextConfig} */

const nextConfig = {
	images: {
		remotePatterns: [
			{ protocol: 'http', hostname: 'res.cloudinary.com' },
			{ protocol: 'https', hostname: 'res.cloudinary.com' },
			{ protocol: 'http', hostname: 'localhost' },
			{ protocol: 'https', hostname: 'localhost' },
			{ protocol: 'http', hostname: '127.0.0.1' },
			{ protocol: 'https', hostname: '127.0.0.1' },
		],
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
};

export default nextConfig;
