/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },
  // 1. Required if you use the <Image /> component
  images: {
    unoptimized: true, 
  },
  // 2. Recommended for Spring Boot / Web Server compatibility
  trailingSlash: true, 
};

export default nextConfig;