/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  allowedDevOrigins: ["192.168.1.2:3000", "192.168.1.2"],
};

export default nextConfig;
