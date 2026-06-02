/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  allowedDevOrigins: [
    "192.168.1.2:3000",
    "192.168.1.2",
    "192.168.43.235:3000",
    "192.168.43.235"
  ],
};

export default nextConfig;
