import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  rewrites: async () => {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${process.env.API_URL || 'http://localhost:3000'}/api/auth/:path*`,
      },
    ];
  }
};

export default nextConfig;
