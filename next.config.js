/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['orderbyte.io', 'images.unsplash.com', 'www.gstatic.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'orderbyte.io',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.gstatic.com',
      },
    ],
  },
}

module.exports = nextConfig

