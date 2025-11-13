import { withPWA } from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
    pwa: {
        dest: 'public',
        register: true,
        skipWaiting: true,
    },
});

export default nextConfig;
