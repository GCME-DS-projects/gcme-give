import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Disable ESLint during builds for deployment
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow TypeScript errors during builds for deployment
    ignoreBuildErrors: true,
  },
  rewrites: async () => {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${process.env.API_URL || 'http://localhost:3001'}/api/auth/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',      
        pathname: '/**',     
      },
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',
      },
    ],
  },
  output: 'standalone',
};

export default nextConfig;
